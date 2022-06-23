const axios = require('axios')
const WebSocket = require('ws');

axios.defaults.timeout = 30000

class NekoRooms {
  baseUrl = `https://${process.env.NEKO_ROOMS_TRAEFIK_DOMAIN}`
  roomsUrl = `https://${process.env.NEKO_ROOMS_TRAEFIK_ROOMS_DOMAIN}`
  user = process.env.NEKO_ROOMS_USER
  password = process.env.NEKO_ROOMS_PWD
  maxConcurrent = 10

  constructor (provider) {
    if (provider) {
      this.baseUrl = provider.baseUrl
      this.roomsUrl = provider.roomsUrl
      this.user = provider.user
      this.password = provider.pwd
      this.maxConcurrent = provider.maxConcurrent || 10
    }
  }
  nekoAxiosAuth () {
    return {
      auth: {
        username: this.user,
        password: this.password
      }
    }
  }

  userRoomName (username) {
    return 'U00-' + username.replace(/[^a-zA-Z0-9_.-]/g, '_')
  }

  async list () {
    const res = await axios.get(`${this.baseUrl}/api/rooms`, this.nekoAxiosAuth())
    return res.data
  }

  async stats (id) {
    const stats = await axios.get(`${this.baseUrl}/api/rooms/${id}/stats`, this.nekoAxiosAuth())
    return stats.data
  }

  async orphans () {
    const rooms = await this.list()
    const stats = await Promise.all(rooms.forEach(r => this.stats(r.id)))
    return stats.filter(s => s.members.length)
  }

  async create (nekoPayload) {
    const list = await this.list()
    if (list.length >= this.maxConcurrent) {
      throw new Error('Max concurrent rooms limit reached')
    }
    const res = await axios.post(`${this.baseUrl}/api/rooms`, nekoPayload, this.nekoAxiosAuth())
    const room = {
      ...nekoPayload,
      ...res.data,
      url: this.roomsUrl + '/' + res.data.name + '/',
      wurl: `${this.roomsUrl.replace('http', 'ws')}/${res.data.name}/ws`
    }
    await this.roomReady(room)
    console.log("Room ready: ", room)
    return room
  }

  async find (name) {
    const list = await this.list()
    const room = list.filter(e => e.name === name)[0]
    const settings = await this.settings(room.id)
    return {
      ...room,
      ...settings,
      wurl: `${this.baseUrl.replace('http', 'ws')}/${room.name}/ws`
    }
  }

  async settings (id) {
    const settings = await axios.get(`${this.baseUrl}/api/rooms/${id}/settings`, this.nekoAxiosAuth())
    return settings.data
  }

  async delete (id) {
    const res = await axios.delete(`${this.baseUrl}/api/rooms/${id}`, this.nekoAxiosAuth())
    return res.data
  }

  async stop (name) {
    const room = await this.find(name)
    const res = await axios.post(`${this.baseUrl}/api/rooms/${room.id}/stop`, null, this.nekoAxiosAuth())
    return res.data
  }

  async start (name) {
    const room = await this.find(name)
    if (!room.running) {
      await axios.post(`${this.baseUrl}/api/rooms/${room.id}/start`, null, this.nekoAxiosAuth())
    }
    return await this.roomReady(room)
  }

  async restart (id) {
    await axios.post(`${this.baseUrl}/api/rooms/${id}/stop`, null, this.nekoAxiosAuth())
    await axios.post(`${this.baseUrl}/api/rooms/${id}/start`, null, this.nekoAxiosAuth())
  }

  async startOrCreate (nekoPayload) {
    try {
      return await this.start(nekoPayload.name)
    } catch {
      return await this.create(nekoPayload)
    }
  }

  async roomReady (room) {
    const wait = tout => new Promise(r => setTimeout(r, tout))
    console.log("Waiting for room: ", room)
    await wait(15000)
    return
    const url = `${room.wurl}?password=${room.admin_pass}`
    const check = () => new Promise((resolve, reject) => {
      const ws = new WebSocket(url)
      ws.on('unexpected-response', err => {
        console.log("neko-rooms waitRoom ws error", err)
        reject()
      })
      ws.on('open', () => {
        ws.close()
        resolve()
      })
    })
    // Wait for container initialization
    return new Promise(async (resolve, reject) => {
      let attempts = 3
      while(attempts) {
        try {
          await check()
          return resolve()
        } catch {
          --attempts
        }
        await wait(1000)
      }
      resolve()
    })
  }

  async snapshot (id) {
    const res = await axios.post(`${this.baseUrl}/api/rooms/${id}/snapshot`, null, this.nekoAxiosAuth())
    return res.data
  }
}

module.exports = NekoRooms