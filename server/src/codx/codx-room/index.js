const cloudProviders = require('../../cloudprovider')
const NekoRooms = require('../../neko-rooms')
const uuid = require('uuid').v4;

module.exports = strapi => {
  const domain = process.env.WEB_DOMAIN
  return {
    createTraefikConfigurationService ({ prefix, serviceUrl, isRemote, host, protocol }) {
      const pathPrefix = `/${prefix}`
      const middlewares = {
        [`codx-room-${prefix}rdr`]: {
          redirectRegex: {
            regex: pathPrefix + "$$",
            replacement: pathPrefix + "/"
          }
        },
        [`codx-room-${prefix}cors`]: {
          headers: {
            accessControlAllowOriginList: ["*"]
          }
        }
      }
      if (!isRemote) {
        middlewares[`codx-room-${prefix}prf`] = {
          stripPrefix: {
            prefixes: [
              pathPrefix + "/"
            ],
            forceSlash: true
          }
        }
      }
      const middlewaresIds = Object.keys(middlewares)
      const services = {
        [`codx-room-${prefix}`]: {
          loadBalancer: {
            servers: [
              {
                url: serviceUrl
              }
            ],
            passHostHeader: false
          }
        }
      }
      const routers = {
        [`codx-room-${prefix}`]: {
          entryPoints: [
            protocol === 'https' ? "websecure": "web"
          ],
          middlewares: middlewaresIds,
          service: `codx-room-${prefix}`,
          rule: `PathPrefix(\`${pathPrefix}\`) && Host(\`${host || domain}\`)`,
          tls: {
            "certResolver": process.env.PROXY_TLS_RESOLVER || "myresolver"
          }
        }
      }
      return {
        middlewares,
        services,
        routers
      }
    },
    createTraefikConfiguration ({ host, protocol, prefix, ip, roomsUrl, serviceUrl: remoteServiceUrl }) {
      const isRemote = roomsUrl.indexOf(domain) === -1
      const serviceUrl = isRemote ? remoteServiceUrl : `http://${ip}:${8080}`
      const neko = this.createTraefikConfigurationService({ host, protocol, prefix, serviceUrl, roomsUrl, isRemote })
      const openPorts = [['mysite', 3000, true], ['coder', 9080, false]]
        .map(([serviceName, port, isRemote]) => this.createTraefikConfigurationService({ isRemote, host, protocol, prefix: prefix + '-' + serviceName, serviceUrl:`http://${ip}:${port}`, roomsUrl }))
      return openPorts.reduce((http, { middlewares, services, routers }) => {
         return {
          middlewares: {
            ...http.middlewares,
            ...middlewares
          },
          services: {
            ...http.services,
            ...services
          },
          routers: {
            ...http.routers,
            ...routers
          }
        }
      }, neko)
    },
    getRoomPublicUrls ({ roomsUrl, prefix}) {
      const pathPrefix = `/${prefix}`
      const url = `https://${process.env.WEB_DOMAIN}${pathPrefix}`
      return {
        url,
        wurl: `${url.replace("http", "ws")}/ws`,
        pathPrefix
      }
    },
    async waitForRoom () {
      const wait = tout => new Promise(r => setTimeout(r, tout))
      return wait(5000)
    },
    async createRoom ({ user, settings }) {
      const { roomSettings: { type } } = settings
      if (type === 'container') {
        return this.createContainer({ user, settings })
      }
      return this.createVps({ user, settings })
    },
    async createContainer ({ user, settings = {} }) {
      const {
        template: { repository, folder },
        roomSettings: { image },
        cloudProvider: { name: provider, settings: nekoRoomsProvider }
      } = settings
      const neko_image = image || nekoRoomsProvider.nekoImage || "codx/room:latest"
      const { mounts = [] } = nekoRoomsProvider || {}
      const nekoRooms = new NekoRooms(nekoRoomsProvider)

      const nekoPwd = `${uuid()}`.slice(0, 5)
      const nekoAdminPwd = `${uuid()}`.slice(0, 5)
      const nekoSettings = {
        admin_pass: nekoAdminPwd,
        user_pass: nekoPwd,
        audio_bitrate: 128,
        audio_codec: "OPUS",
        audio_pipeline: "",
        broadcast_pipeline: "",
        control_protection: false,
        envs: {},
        implicit_control: true,
        max_connections: 10,
        mounts: [],
        name: "",
        neko_image,
        screen: "1280x720@30",
        video_bitrate: 3072,
        video_codec: "VP8",
        video_max_fps: 25,
        video_pipeline: "",
        envs: {
          GIT_REPO_PROJECT: repository,
          GIT_REPO_FOLDER: folder,
          ...user.envs
        },
        mounts
      }
      const room = await nekoRooms.create(nekoSettings)
      const proxy = { 
        id: room.id, 
        username: user.username,
        roomName: settings.name, 
        roomsUrl: nekoRoomsProvider.roomsUrl,
        ip: room.ip,
        serviceId: settings.name,
        serviceUrl: room.url,
        prefix: room.name
      }
      return {
        proxy,
        neko: {
          ...room,
          nekoSettings,
        },
        nekoAdminPwd,
        nekoPwd,
        config: settings,
        provider
      }
    },
    async createVps ({ user, providerName, settings, cloudProvider }) {
      console.log("codx-room", "createRoom", { user, providerName, settings, cloudProvider })
      const provider = cloudProviders[providerName](cloudProvider.settings)
      const nekoPwd = `${uuid()}`.slice(0, 5)
      const nekoAdminPwd = `${uuid()}`.slice(0, 5)
      const { repository, folder } = settings
      const env = [
        ['CODX_AUTH_TOKEN', user.token],
        ['NEKO_PASSWORD', nekoPwd],
        ['NEKO_ADMIN_PASSWORD', nekoAdminPwd],
        ['API_DOMAIN', process.env.API_DOMAIN],
        ['GIT_REPO_PROJECT',  repository],
        ['GIT_REPO_FOLDER',  folder]
      ]
      const room = await provider.createRoom({
        room: {
          ...settings,
          env,
          name: uuid()
        }
      })
      const proxy = { 
        id: room.data.server.id, 
        username: user.username, 
        roomName: settings.name, 
        ip: room.data.server.public_net.ipv4.ip, 
        serviceId: room.config.name,
        serviceUrl: room.proxy.url
      }
      await this.waitForRoom()
      return {
        ...room,
        proxy,
        nekoAdminPwd,
        nekoPwd,  
        cloudProvider: providerName,
        config: settings
      }
    },
    deleteRoom (room) {
      const { config: { roomSettings: { type } } } = room
      if (type === 'container') {
        return this.deleteContainer(room)
      }
      return this.deleteVps(room)
    },
    async deleteContainer ({ neko: { id }, config: { roomSettings: { provider } } }) {
      const [nekoRoomsProvider = {}] = await strapi.$query('cloud-provider').findMany({ filters: { name: provider }})
      console.log("delete container", { provider, nekoRoomsProvider })
      const nekoRooms = new NekoRooms(nekoRoomsProvider.settings)
      return nekoRooms.delete(id)
    },
    async deleteVps ({ cloudProvider: providerName }) {
      const providerSettings = await strapi.$query('cloud-provider').findMany({ 
        filters: { name: providerName },
      })
      const provider = cloudProviders[providerName](providerSettings[0].settings)
      await provider.deleteRoom(room)
    },
    async listRooms (user = {}) {
      const nekoRooms = await strapi.$query('neko-room').findMany({
        filters: { 
          $or: [
            { user: [user.id] },
            { chat: {
                $or: [
                  { admins: [user.id] },
                  { guests: [user.id] }
                ]
              },
            }
          ]
        },
        populate: {
          user: true,
          chat: true
        }
      })
      return nekoRooms
        .filter(room => room.user && !room.deleted)
        .map(room => {
          if(!room.user) {
            room.user = user
          }
          return this.getRoomPublicInfo(room, user)
        })
    },
    getRoomPublicInfo (room, { reqUserId } = {}) {
      const { id, name, description, createdAt,
        user: { id: userId, username },
        room: { proxy: { roomsUrl, prefix },
          neko: { name: roomName },
          nekoPwd, nekoAdminPwd, provider
        },
        chat
      } = room
      const { id: chatId } = chat||{}
      const { url } = this.getRoomPublicUrls({ roomsUrl, prefix })
      return {
        id,
        name,
        description,
        createdAt,
        url,
        user: { id: userId, username },
        nekoPassword: !reqUserId || reqUserId === user.id ? nekoAdminPwd : nekoPwd,
        chat: { id: chatId },
        provider
      }
    },
    async roomProxies ({ token, host, protocol }) {
      const nekoRooms = (await strapi.$query('neko-room').findMany({ populate: { user: true, cloud_provider: true }}))
              .filter(({ room: { proxy: { roomsUrl } }}) => !host || roomsUrl.indexOf(host) !== -1)
      const res = nekoRooms
        .map(({ room: { proxy: { prefix, roomsUrl, serviceUrl, ip }, neko: { id } } }) =>
          this.createTraefikConfiguration({ host, protocol, prefix, ip: ip || id.substring(0, 12), roomsUrl, serviceUrl })
        )
      return res
    }
  }
}