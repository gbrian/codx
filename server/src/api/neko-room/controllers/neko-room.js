'use strict';

/**
 *  neko-room controller
 */
const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::neko-room.neko-room', ({ strapi }) => {
  const codx = require('../../../codx')(strapi)
  return {
    async create ({ request: { body, header: { authorization } }, state: { user } }) {
      let { chat, settings } = body
      const currentCredits = user.credits || 0
      if (!currentCredits || (settings.credits || 0) > currentCredits) {
        throw new Error("Not enough credits to run clinic.")
      }

      chat = chat?.id ? await strapi.$api('chat').findOne(chat.id) : null
      user.token = authorization.split(" ")[1]
      const {
        roomSettings: { provider }
      } = settings
      settings.cloudProvider = (await strapi.$query('cloud-provider').findMany({ filters: { name: provider }}))[0]

      const room = await codx.room.createRoom({ user, settings })
      const nekoRoom = await strapi.$api('neko-room').create({ data: {
        user,
        chat,
        settings,
        room,
        name: settings.name,
        description: settings.description,
        cloudProvider: settings.cloudProvider
      }})
      return codx.room.getRoomPublicInfo({ ...nekoRoom, user, chat })
    },
    async find ({ state: { user }}) {
      return codx.room.listRooms(user)
    },
    async delete ({ state: { user }, params: { id } }) {
      // return strapi.$api('neko-room').update(id, { data: { deleted: true }})
      const { room } = await strapi.$api('neko-room').findOne(id)
      console.log("neko-rooms", "delete", { user, room })
      codx.room.deleteRoom(room)
      return strapi.$api('neko-room').delete(id)
    },
    async proxy ({ query: { token, host, protocol }}) {
      try {
        const nekoRooms = await codx.room.roomProxies({ token, host, protocol: protocol || 'https' })
        const http = nekoRooms.reduce((conf, { middlewares, services, routers }) => {
          conf.middlewares = {
            ...conf.middlewares,
            ...middlewares
          }
          conf.services = {
            ...conf.services,
            ...services
          }
          conf.routers = {
            ...conf.routers,
            ...routers
          }
          return conf
        },
        { middlewares: {},
          services: {},
          routers: {}
        })
        return { http }
      } catch (ex) {
        console.error(ex)
      }
    },
    async installer ({ params: { id }, state: { user }, request: { ip, header: { authorization } } }) {
      user.token = authorization.split(" ")[1]
      const cloudProvider = await strapi.$api('cloud-provider').findOne(id, { populate: { company: true } })
      // const userCompanies = (await codx.user.companies(user)).filter(({ id: cid, admins }) => cid === id && )
    }
  }
});
