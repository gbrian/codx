import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { $storex } from '@/store'
import api from '@/api'

export const namespaced = true

export const state = () => ({
  channels: null,
  chats: {},
  currentChannel: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setChannels (state, channels = []) {
    state.channels = channels.sort((a, b) => a.name >= b.name ? -1 : 1)
    if (state.currentChannel) {
      $storex.channel.setCurrentChannel(state.currentChannel)
    }
  },
  async setCurrentChannel (state, channel) {
    if (state.channels) {
      state.currentChannel = state.channels.filter(c => c.id === channel?.id)[0]
    }
  },
  async updateChannel ({ channels }, id) {
    if (!id) {
      return
    }
    const { data: channel } = await api.getChannel(id)
    const newChannels = [...channels.filter(c => c.id !== channel.id), channel]
    $storex.channel.setChannels(newChannels)
  },
  addChat (state, chat) {
    state.chats = {
      ...state.chats,
      [chat.id]: chat
    }
  },
  addMessageToChat (state, message) {
    
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    },
    async openChannel (ctx, { id } = {}) {
      await $storex.channel.updateChannel(id)
      requestAnimationFrame(() => {
        const channel = $storex.channel.channels.filter(c => c.id === id)[0]
        $storex.channel.setCurrentChannel(channel)
      })
    },
    async createChannel ({ state: { channels }}, channelSettings) {
      const { user: { id } } = $storex.user
      const { data: channel } = await api.createChanne({
        ...channelSettings,
        users: [id],
        user: id,
        entries: []
      })
      $storex.channel.setChannels([...channels, channel])
    },
    async newEntry(ctx, { channel, entry }) {
      const { data: { id } } = await api.newChannelEntry({ channel, entry })
      $storex.channel.updateChannel(id)
    },
    async refreshChat (ctx, id) {
      const { data: chat } = await api.loadChat(id)
      $storex.channel.addChat(chat)
      return chat
    }
  },
)