/* eslint no-empty-pattern: 0 */
import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { $storex } from '@/store'

export const namespaced = true

import api from '@/api'

export const state = () => ({
  authenticated: false,
  token: localStorage.getItem("token") || "",
  user: null,
  lastLogin: null,
  session: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  async onSignup (state, { authenticated, user, token }) {
    state.authenticated = authenticated
    state.token = token
    state.user = user
    state.lastLogin = new Date()
    $storex.user.updateStatistics(user.statistics)
    const { username, chats, channels, clinics, session = {} } = user || {}
    // TODO: pass to neko
    localStorage.setItem("displayname", username)
    state.session = session
    $storex.network.init()
    $storex.session.init()
    $storex.clinic.init()
    $storex.clinic.setClinics(clinics)
    $storex.chat.setChats(chats)
    $storex.channel.setChannels(channels)
  },
  updateStatistics ({ user }, statistics) {
    if (!statistics) {
      return
    }
    const kv = Object.keys(statistics).map(k => [k, statistics[k]])
    const dates = kv.filter(([k,v]) => /[0-9]{4}-[0-9]{2}-[0-9]{2}/.exec(v))
                    .map(([k,v]) => [k, Date.parse(v)])
                    .reduce((acc, v) => [acc, acc[v[0]] = v[1]][0], {})
    user.statistics = {
      ...user.statistics || {},
      ...statistics,
      ...dates
    }
  },
  setOnline ({ user }, online) {
    user.online = online
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchAccessToken({ state: { lastLogin }}, force) {
      const token = localStorage.getItem("token")
      const fecthPayload = {
        authenticated: false
      }
      if (token) {
        if (!force && lastLogin && (new Date() - lastLogin) < 60000) {
          console.log("No need to refresh token")
          return
        }
        try {
          const { data: user } = await api.me(token)
          fecthPayload.authenticated = true
          fecthPayload.user = user
          fecthPayload.token = token
        } catch (ex) {
          console.error("Invalid token: ", token)
        }
      }
      $storex.user.onSignup(fecthPayload)
    },
    async signup({}, signload) {
      try {
        const { data: { jwt: token }} = await api.register(signload)
        const { data: user } = await api.me(token)
        const payload = {
          token: token,
          user: user,
          authenticated: true,
        }
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        $storex.user.onSignup(payload)
        this.app.$notify({
            text: "Success",
            group: "success"
          }, 2000);
        } catch (e) {
          this.app.$notify({
              text: "Ops, something went wrong!",
              group: "error"
            }, 2000);
          throw e
        }
    },
    async login({}, loginload) {
      try {
        this.app.$notify({
          text: "loging...",
          group: "generic"
        }, 2000);
        const { data: { jwt: token }} = await api.login(loginload)
        const { data: user } = await api.me(token)
        const payload = {
          token: token,
          user: user,
          authenticated: true,
        }
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", token)
        $storex.user.onSignup(payload)
        this.app.$notify({
          text: "Success",
          group: "success"
        }, 2000);
      } catch(e) {
        this.app.$notify({
          text: e.response?.data?.error?.message,
          group: "error"
        }, 2000);
        throw e
      }
    },
    async logout () {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      $storex.user.onSignup({ authenticated: false })
    },
    async loginWithProvider (ctx, { provider, access_token }) {
      const { data: { jwt: token } } = await api.loginWithProvider({ provider, access_token })
      localStorage.setItem("token", token)
      await $storex.user.fetchAccessToken(true)
    },
    notify (ctx, message) {
      this.app.$notify({
        text: message,
        group: "generic"
      }, 2000);
    }
  }
)