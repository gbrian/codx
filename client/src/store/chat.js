import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import api from '@/api'
import { $storex } from '.'

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
    m.createdAt = Date.parse(m.createdAt)
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
      return !!(this.unreadMessages||[]).filter(({ content }) => content.indexOf(mention) !== -1).length
    },
    get lastView () {
      return (this.readReceipt||{})[me.id] || this.createdAt
    },
    get isAdmin () {
      return this.admins.filter(a => a.id === me.id).length !== 0
    },
    get chatName () {
      return this.name || this.users.filter(({ username }) => me.username !== username)
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
      messages: JSON.parse(JSON.stringify(messages))
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
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    },
    async newChat (ctx, chatSettings) {
      const { data: chat } = await api.createChat(chatSettings)
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
    },
    async updateChat (ctx, { id, changes }) {
      const chat = await api.updateChat(id, changes)
      $storex.chat.addChat(chat)
    }
  },
)