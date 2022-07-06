import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { $storex } from '.'
import api from '@/api'

export const namespaced = true

export const state = () => ({
  friends: {},
  allUsers: {}
})

export const getters = getterTree(state, {
  onlineFriends: ({ friends }) => {
    if (!friends) {
      return {}
    }
    const online = Object.keys(friends).filter(id => friends[id].online)
    return online.reduce((acc, id) => [acc, (acc[id] = friends[id])][0], {})
  }
})

export const mutations = mutationTree(state, {
  setNetwork (state, { friends = [] } = {}) {
    state.friends = friends.map(f => ({ ...f, isFriend: true }))
      .reduce((acc, v) => [acc, (acc[v.id] = v)][0], {})
    $storex.network.updateAllUsers()
  },
  updateFriendStatus (state, friendStatus = []) {
    const { friends } = state
    Object.values(friends).forEach(f => { f.online = false })
    friendStatus.forEach(friend => {
      const existingFriend = friends[friend.id]
      if (existingFriend) {
        Object.assign(existingFriend, friend)
      } else {
        friends[friend.id] = friend
      }
    })
    $storex.network.updateAllUsers()
  },
  updateAllUsers (state) {
    const { user } = $storex.user
    if (user) {
      state.allUsers = {
        [user.id]: {
          ...user,
          isMe: true,
          online: $storex.session.isOnline
        },
        ...state.friends
      }
    } else {
      state.allUsers = null
    }
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async init ({ state }) {
      const user = $storex.user.user
      if (user) {
        $storex.network.setNetwork(user.network || {})
      } else {
        $storex.network.setNetwork({})
      }
    },
    async joinUser ({ state: { token } }, user) {
      await api.updateNetwork({ addFriend: user })
      await api.me(token)
    },
    async joinCompany ({ state: { token } }, company) {
      await api.updateNetwork({ addCompany: company })
      await api.me(token)
    }
  },
)