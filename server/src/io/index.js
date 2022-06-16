const rtcmulticonnectionServer = require('rtcmulticonnection-server')
const socketIo = require('socket.io')
const session = require('./session')
const codx = require('../codx')

class ioManager {
  users = {}
  sockets = {}
  constructor(strapi) {
    this.strapi = strapi
    this.codx = codx(strapi)
    this.waitForServer()
    this.session = session(strapi)
  }

  get onlineUsers () {
    const now = new Date()
    return Object.keys(this.users)
      .filter(k => (now - this.users[k].lastOnline) <= 60000)
      .map(k => this.users[k])
      .reduce((acc, u) => {
        acc[u.id] = u
        return acc
      }, {})
  }

  get offlineUserIds () {
    const now = new Date()
    return Object.keys(this.users)
      .filter(k => (now - this.users[k].lastOnline) > 60000)
  }

  waitForServer () {
    if (!this.strapi.server) {
      setTimeout(() => {
        console.log("IO", "strapi server not ready")
        this.waitForServer()
      }, 500)
    }
    console.error("io", "Use strapi cors settings here")
    this.io = socketIo(strapi.server.httpServer, {
      cors: {
        origin: "*"
      }
    })
      .on('connection', (socket) => {
        rtcmulticonnectionServer.addSocket(socket);
        rtcmulticonnectionServer.pushLogs({}, 'ioManager', { message: 'Socket added to rtcmulticonnection-server' })
        this.onConnection(socket)
      })
    this.rooms = {}
  }

  onConnection(socket) {
    // Say hi
    try {
      socket.on('heartbeat', user => this.onHeartBeat({ ...user, socket }))
      socket.on('log', event => this.onLog(event))
      this.onNewConnectionClinicEvents(socket)
      console.log("new socket", socket.handshake)
    } catch (ex) {
      console.error("io", "new socket connection error", { ex })
    }
  }

  onNewConnectionClinicEvents (socket) {
    socket.on('clinic-request-control', ({ user: { id }, clinic: { id: clinicId } }, cb) => {
      try {
        const user = this.users[id]
        const { network: { friends = [] } } = user
        console.log("clinic-request-control", id, friends)
        Promise.all(friends.filter(fid => !!this.users[fid]?.socket)
            .map(fid => new Promise(ok => {
            try {
              this.users[fid].socket.timeout(2000).emit('clinic-request-control', { user: { id }, clinic: { id: clinicId } }, err => { 
                ok(err + "")
              })
            } catch (err) {
              ok(err + "")
            }
        }))
        )
        .then(responses => {
          console.log("clinic-request-control", "callback done", responses)
          cb()
        })
      } catch (ex) {
        console.error(ex)
      }
    })
  }

  async onHeartBeat (user) {
    const { socket } = user
    this.sockets[socket.id] = {
      id: socket.id,
      socket,
      user
    }
    const lastOnline = new Date()
    if (!this.users[user.id]) {
      user.statistics = await this.codx.user.updateUserStatistics(user.id, {
        lastOnline
      })
    }
    this.users[user.id] = {
      ...user,
      lastOnline
    }
    this.refreshUsers([user])
    this.offlineUserIds.forEach(id => {
      delete this.users[id]
      this.userSockets({ id })
          .forEach(id => delete this.sockets[id])
    })
  }

  userSockets ({ id }) {
    const { sockets } = this
    return  Object.values(sockets)
              .filter(socket => socket.user.id === id)
              .map(({ socket }) => socket)
  }

  onLog ({user, log}) {
    console.log("user-log", { user, log })
  }

  emit (event, data, userIds = null) {
    try {
      console.log("io", "Emmiting ", { event, data, userIds })
      if (!userIds) {
        userIds = Object.keys(this.onlineUsers)
      } 
      const users = userIds.map(id => this.onlineUsers[id]).filter(u => !!u)
      users.forEach(user => {
        try {
          this.userSockets(user).forEach(socket => 
            socket.emit(event, data, (...args) => {
                console.log("io", "user ack", { id: user.id, args });
              })
          )
        } catch (ex) {
          console.error("io", "Error emmiting to user", { id: user.id, event, ex })
        }
      })
    } catch (ex) {
      console.error("io", "Error emmiting ", { event, ex })
    }
  }

  refreshUsers (users) {
    users.forEach(async user => {
      this.userSockets(user).forEach(async socket => { 
        try {
          const data = await this.session.status(user)
          socket.emit('heartbeat', data)
        } catch (ex) {
          console.error("heartbeat", ex)
        }
      })
    })
  }
}

module.exports = ioManager
