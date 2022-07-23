import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import api from '@/api'
import { $storex } from '.'
import moment from 'moment'

export const namespaced = true

export const state = () => ({
  chats: {},
  openedChat: null
})

export const getters = getterTree(state, {
  userChats: ({ chats }) => Object.keys(chats)
                            .map(k => chats[k])
                            .filter(({ isChannel }) => !isChannel)
                            .sort(a => a.clinic ? -1 : 1),
  unreadMessages: ({ chats }) => Object.keys(chats)
                                  .map(k => chats[k])
                                  .filter(({ isChannel, unreadMessages }) => !isChannel && unreadMessages),
  missingMentions: ({ chats }) => Object.keys(chats)
                                  .map(k => chats[k])
                                  .filter(({ isChannel, missingMention }) => !isChannel && missingMention)
})

function prepareChat (chat, { visible }) {
  const { id, admins = [], guests = [], messages = [] } = chat
  messages.forEach(m => {
    m.from = $storex.network.allUsers[m.from.id]
    m.createdAt = moment(m.createdAt)
  })
  const me = $storex.user.user
  const mention = `@${me.username}`
  return {
    ...chat,
    admins,
    guests,
    visible,
    messages,
    clinic: $storex.clinic.clinics.filter(({ chat: { id } }) => id === chat.id)[0],
    get users () {
      return this.admins.concat(this.guests)
        .map(u => ($storex.network.allUsers||[])[u.id] || u)
    },
    get unreadMessages () {
      const unread = this.messages.filter(({ createdAt }) => createdAt > this.lastView)
      return unread.length ? unread : null
    },
    get missingMention () {
      return false // !!(this.unreadMessages||[]).filter(({ content }) => content.indexOf(mention) !== -1).length
    },
    get lastView () {
      return (this.readReceipt||{})[me.id] || this.createdAt
    },
    get isAdmin () {
      return this.admins.filter(a => a.id === me.id).length !== 0
    },
    get chatName () {
      return this.name || this.users
        .map(({ username }) => '@'+username).join("-")
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
  async setOpenedChat (state, { id, visible } = {}) {
    const chat = state.chats[id]
    if (chat) {
      chat.visible = visible
    }
    state.openedChat = chat
  },
  async addMessage (state, { id, chat: { id: chatId }, from, content, createdAt, extra, edited }) {
    if (!state.chats[chatId]) {
      await $storex.chat.refreshChat({ id: chatId })
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
      messages: [...messages]
    })
    if (chatId === state.openedChat?.id) {
      if (state.openedChat.visible) {
        const me = $storex.user.user
        state.openedChat.readReceipt[me.id] = new Date()
      }
      state.openedChat = state.chats[chatId]
    }
  },
  async deleteChat (state, chat) {
    await api.deleteChat(chat)
    $storex.chat.removeChat(chat)
  },
  removeChat (state, { id }) {
    const { chats } = state
    delete chats[id]
    state.chats = {
      ...chats,
    }
    if (state.openedChat?.id === parseInt(id)) {
      $storex.chat.setOpenedChat()
    }
  },
  setChatVisible(state, { id, visible }) {
    const me = $storex.user.user
    const chat = state.chats[id]
    state.chats = {
      ...state.chats,
      [id]: {
        ...chat,
        readReceipt: {
          ...chat.readReceipt,
          [me.id]: visible ? new Date() : chat.readReceipt[me.id]
        },
        visible
      }
    }
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    },
    async newChat (_, chatSettings) {
      const { data: chat } = await api.createChat(chatSettings)
      $storex.chat.addChat(chat)
      return chat
    },
    async sendMessage (_, { chat, content, extra, id }) {
      const { user: from } = $storex.user
      await api.sendMessage({ chat, content, from, extra, id })
    },
    async addUser (_, { chat, user }) {
      await api.chatAddUser({ chat, user })
      await $storex.chat.refreshChat(chat)
    },
    async removeUser (_, { user, chat }) {
      await api.removeUserFromChat({ user, chat })
      await $storex.chat.refreshChat(chat)
    },
    async onEditMessage (_, { chat, message }) {
      await api.sendMessage({ chat, ...message })
    },
    async refreshChat (_, { id, isChannel = false }) {
      const { data: chat } = await api.loadChat(id)
      $storex.chat.addChat({ ...chat, isChannel })
      return chat
    },
    formatMessage(_, newMessage) {
      return newMessage.content
    },
    async updateChat (_, { id, changes }) {
      await api.updateChat(id, changes)
      await $storex.chat.refreshChat({ id })
    },
    async openChat (_, { id, visible } = {}) {
      if (id) {
        await $storex.chat.refreshChat({ id })
      }
      $storex.chat.setOpenedChat({ id, visible })
    }
  },
)