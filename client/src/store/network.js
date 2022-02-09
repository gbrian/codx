import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { $storex } from '.'

export const namespaced = true

export const state = () => ({
  friends: null,
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
  setNetwork (state, { friends }) {
    state.friends = friends.map(f => ({ ...f, isFriend: true }))
      .reduce((acc, v) => [acc, (acc[v.id] = v)][0], {})
    $storex.network.updateAllUsers()
  },
  updateFriendStatus (state, friendStatus = []) {
    const friends = friendStatus.reduce((acc, v) => [acc, (acc[v.id] = v)][0], {})
    state.friends = {
      ...state.friends,
      ...friends
    }
    $storex.network.updateAllUsers()
  },
  updateAllUsers (state) {
    const { user } = $storex.user
    state.allUsers = {
      [user.id]: {
        ...user,
        isMe: true
      },
      ...state.friends
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
    }
  },
)