import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import api from '@/api'

export const namespaced = true

export const state = () => ({
  chats: null,
  channels: null,
  openedChat: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setChats ({}, chats = []) {
    chats.forEach(c => $storex.chat.addChat(c))
  },
  addChat (state, chat) {
    const { id, admins = [], guests = [] } = chat
    state.chats = {
      ...state.chats,
      [id]: {
        ...chat,
        admins,
        guests,
        get users () {
          return this.admins.concat(this.guests)
            .map(u => $storex.network.allUsers[u.id] || u)
        }
      }
    }
  },
  setChannels (state, channels) {
    state.channels = channels
  },
  async setOpenedChat (state, id) {
    if (id) {
      const { data: chat } = await api.loadChat(id)
      $storex.chat.addChat(chat)
    }
    if (state.chats) {
      state.openedChat = state.chats[id]
    }
  },
  async addMessage (state, { chat: { id }, from, content, createdAt, extra }) {
    if (!state.chats[id]) {
      const { data: chat } = await api.loadChat(id)
      $storex.chat.addChat(chat)
    }
    const { messages = [] } = state.chats[id]
    messages.push({
      from, content, createdAt, extra
    })
    state.chats = {
      ...state.chats,
      [id]: {
        ...state.chats[id],
        messages
      }
    }
    if (state.openedChat && id === state.openedChat.id) {
      state.openedChat = state.chats[id]
    }
  },
  async deleteChat (state, chat) {
    await api.deleteChat(chat)
    const { chats } = state
    delete chats[chat.id]
    state.chats = {
      ...chats,
    }
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    },
    async newChat () {
      const { data: chat } = await api.createChat({})
      $storex.chat.addChat(chat)
      return chat
    },
    async sendMessage (ctx, { chat, content, extra }) {
      const { user: from } = $storex.user
      await api.sendMessage({ chat, content, from, extra })
    },
    async addUser (ctx, chatAddUser) {
      await api.chatAddUser(chatAddUser)
      $storex.chat.setOpenedChat(chatAddUser.chat.id)
    }
  },
)