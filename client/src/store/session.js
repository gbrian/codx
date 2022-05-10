import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import WebRTCRoom from '@/webrtc'
import { $storex } from '.'

export const namespaced = true

export const state = () => ({
  userRoom: null,
  heartbeat: null,
  lastHeartBeat: null,
  isOnline: false
})

export const getters = getterTree(state, {
  socket: state => state.userRoom?.socket
})

export const mutations = mutationTree(state, {
  setRoom (state, room) {
    if (state.userRoom) {
      state.userRoom.disconnect()
      clearInterval(state.heartbeat)
      state.heartbeat = null
    }
    state.userRoom = room
    if (room) {
      const { socket } = room
      const heartbeat = () => {
        if (state.lastHeartBeat && (new Date() - state.lastHeartBeat) > 30000) {
          console.error("session", "user offline")
          state.isOnline = false
          $storex.user.setOnline(state.isOnline)
          if (!socket.connected) {
            $storex.session.init()
          }
        }
        const { user: { id, username, network: { friends } } } = $storex.user
        const { chats = {}, openedChat } = $storex.chat
        const { chat: currentClinicChat, cursorPosition } = $storex.clinic.currentClinic || {}
        const { hostingClinic } = $storex.clinic
        socket.emit('heartbeat', {
          id,
          username,
          chats: Object.keys(chats).map(k => parseInt(k)),
          openedChat: openedChat?.id,
          clinic: {
            currentClinicChatId: currentClinicChat?.id,
            cursorPosition,
            hosting: !!hostingClinic
          },
          network: {
            friends: friends?.map(f => f.id)
          }
        })
      }
      state.heartbeat = setInterval(heartbeat, 1000)
      heartbeat()

      socket.on('chat-message', (msg, callbackFn) => {
        try {
          $storex.chat.addMessage(msg)
          callbackFn()
        } catch (ex) {
          console.error(ex)
          callbackFn(ex)
        }
      })
      socket.on('heartbeat', data => {
        const { network: { friends }, statistics } = data
        state.lastHeartBeat = new Date()
        state.isOnline = true

        $storex.network.updateFriendStatus(friends)
        $storex.user.updateStatistics(statistics)
        $storex.user.setOnline(state.isOnline)
      })
      socket.on('welcome', () => {
        $storex.user.fetchAccessToken()
      })
      socket.on('chat-delete', ev => $storex.chat.removeChat(ev))
    }
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async init ({ state }) {
      const user = $storex.user.user
      if (user) {
        const { roomId } = user
        const room = await WebRTCRoom.newRoom({
          name: roomId,
          turnUser: user.webrtc?.turnUser,
          turnPassword: user.webrtc?.turnPassword
        })
        $storex.session.setRoom(room)
      } else if(state.userRoom){
        $storex.session.setRoom(null)
      }
    },
    log (_, log) {
      try {
        const { id, username } = $storex.user.user || { id: 0, username: 'not-logged' }
        const { socket } =  $storex.session
        socket && socket.emit('log', { user: { id, username }, log })
      } catch {}
    },
    addListener (_, { event, cb}) {
      const { socket } =  $storex.session
      socket.on(event, cb)
    },
    emit (_, { event, data, cb }) {
      const { socket } =  $storex.session
      socket.emit(event, data, cb)
    }
  },
)