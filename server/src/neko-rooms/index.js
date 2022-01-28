const axios = require('axios')
const WebSocket = require('ws');

axios.defaults.timeout = 30000

class NekoRooms {
  baseUrl = `https://${process.env.NEKO_ROOMS_TRAEFIK_DOMAIN}`
  maxConcurrent = 10
  nekoAxiosAuth () {
    return {
      auth: {
        username: process.env.NEKO_ROOMS_USER,
        password: process.env.NEKO_ROOMS_PWD
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
      wurl: `${this.baseUrl.replace('http', 'ws')}/${res.data.name}/ws`
    }
    await this.roomReady(room)
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

  async delete (name) {
    const room = await this.find(name)
    const res = await axios.delete(`${this.baseUrl}/api/rooms/${room.id}`, this.nekoAxiosAuth())
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

  async startOrCreate (nekoPayload) {
    try {
      return await this.start(nekoPayload.name)
    } catch {
      return await this.create(nekoPayload)
    }
  }

  async roomReady (room) {
    const url = `${room.wurl}?password=${room.admin_pass}`
    const wait = () => new Promise(r => setTimeout(r, 1000))
    const check = () => new Promise((resolve, reject) => {
      const ws = new WebSocket(url)
      ws.on('unexpected-response', () => {
        reject()
      })
      ws.on('open', () => {
        ws.close()
        resolve()
      })
    })
    // Wait for container initialization
    return new Promise(async (resolve, reject) => {
      let attempts = 60
      while(attempts > 0) {
        try {
          await check()
          resolve()
          return
        } catch {
          --attempts
        }
        await wait()
      }
      reject()
    })
  }
}

const nekoRooms = new NekoRooms()
module.exports = nekoRooms