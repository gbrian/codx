import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import api from '@/api'

export const namespaced = true

export const state = () => ({
  chats: {},
  openedChat: null
})

export const getters = getterTree(state, {
  userChats: ({ chats }) => Object.keys(chats)
                            .map(k => chats[k])
                            .reduce((acc, c) => [acc, !c.isChannel && (acc[c.id] = c)][0], {})
})

function prepareChat (chat, { visible }) {
  const { id, admins = [], guests = [], messages = [] } = chat
  messages.forEach(m => {
    m.from = $storex.network.allUsers[m.from.id]
  })
  return {
    ...chat,
    admins,
    guests,
    visible,
    get users () {
      return this.admins.concat(this.guests)
        .map(u => ($storex.network.allUsers||[])[u.id] || u)
    }
  }
}

export const mutations = mutationTree(state, {
  setChats ({}, chats = []) {
    chats.forEach(c => $storex.chat.addChat(c))
  },
  addChat (state, chat) {
    const { id } = chat
    state.chats = {
      ...state.chats,
      [id]: prepareChat(chat, state.chats[chat.id] || {})
    }
  },
  async setOpenedChat (state, { id, visible }) {
    if (id) {
      const { data: chat } = await api.loadChat(id)
      $storex.chat.addChat({ ...chat, visible })
    }
    if (state.chats) {
      state.openedChat = state.chats[id]
    }
  },
  async addMessage (state, { id, chat: { id: chatId }, from, content, createdAt, extra, edited }) {
    if (!state.chats[chatId]) {
      await $storex.chat.refreshChat({ chatId })
    }
    const { messages = [] } = state.chats[chatId]
    const messageIx = messages.findIndex(m => m.id === id)
    const newMessage = {
      id, from, content, createdAt, extra, edited
    }
    if (messageIx !== -1) {
      messages.splice(messageIx, 1, newMessage)
    } else {
      messages.push(newMessage)  
    }
    $storex.chat.addChat({
      ...state.chats[chatId],
      messages
    })
    if (state.openedChat && id === state.openedChat.id) {
      if (!state.openedChat.visible) {
        this.app.$notify({
          text: $storex.chat.formatMessage(newMessage),
          group: "success"
        }, 2000);
      }
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
    async sendMessage (ctx, { chat, content, extra, id }) {
      const { user: from } = $storex.user
      await api.sendMessage({ chat, content, from, extra, id })
    },
    async addUser (ctx, chatAddUser) {
      await api.chatAddUser(chatAddUser)
      $storex.chat.setOpenedChat(chatAddUser.chat)
    },
    async removeUser ({ state: { openedChat = {} }}, { user, chat }) {
      await api.removeUserFromChat({ user, chat })
      $storex.chat.setOpenedChat(openedChat)
    },
    async onEditMessage (ctx, { chat, message }) {
      await api.sendMessage({ chat, ...message })
    },
    async refreshChat (ctx, { id, isChannel = false }) {
      const { data: chat } = await api.loadChat(id)
      $storex.chat.addChat({ ...chat, isChannel })
      return chat
    },
    formatMessage(ctx, newMessage) {
      return newMessage.content
    }
  },
)