import { useFetch } from "@/api/useFetch"


class Strapi {
  token = null
  get headers () {
    const { token } = this
    if (!token) {
      return {}
    }
    return {
      "Authorization": "Bearer " + token
    }
  }
  me (token) {
    this.token = token
    const { headers } = this
    return token ? useFetch.get("api/users/me", { headers }) : null
  }

  async login (payload) {
    return useFetch
      .post("api/auth/local", payload)
  }

  async register (payload) {
    return useFetch
      .post("api/auth/local/register", { ...payload, username: payload.identifier, password: 'disabled' })
  }

  async createChat (chatSettings) {
    const { headers } = this
    return useFetch.post("api/chats", chatSettings, { headers })
  }

  async deleteChat (chat) {
    const { headers } = this
    return useFetch.delete("api/chats/" + chat.id, { headers })
  }

  async updateChat (id, changes) {
    const { headers } = this
    return useFetch.put("api/chats/" + id, changes, { headers })
  }

  async removeUserFromChat ({ user: { id: userId }, chat: { id } }) {
    const { headers } = this
    return useFetch.delete(`api/chats/${id}?removeUser=${userId}`, { headers })
  }

  async loadChat (id) {
    const { headers } = this
    return useFetch.get(`api/chats/${id}?populate=admins,guests&updateReadRecipe=1`, { headers })
  }

  async sendMessage(chatMessage) {
    const { headers } = this
    const { chat, from } = chatMessage
    const data = { ...chatMessage, chat: { id: chat.id }, from: { id: from.id } }
    return useFetch.post("api/chat-messages", data, { headers })
  }

  async chatAddUser({ chat, user }) {
    const { headers } = this
    return useFetch.put("api/chats/" + chat.id, { guest: user }, { headers })
  }

  async createClinic ({ chat, settings }) {
    const { headers } = this
    return useFetch.post("api/neko-rooms", { chat, settings }, { headers })
  }

  async deleteClinic({ id }) {
    const { headers } = this
    return useFetch.delete("api/neko-rooms/" + id, { headers })
  }

  async findClinics () {
    const { headers } = this
    return useFetch.get("api/neko-rooms", { headers })
  }

  async search (query = { name: "*" }) {
    const { headers } = this
    const search = Object.keys(query).map(k => `${k}=${query[k]}`).join("&")
    return useFetch.get(`api/clinic-templates?${search}`, { headers })
  }

  async createClinicTemplate (clinicTemplate) {
    const { headers } = this
    return useFetch.post("api/clinic-templates", clinicTemplate, { headers })
  }

  async createChanne (channel) {
    const { headers } = this
    return useFetch.post("api/channels", channel, { headers })
  }

  async getChannel (id) {
    const { headers } = this
    return useFetch.get("api/channels/" + id, { headers })
  }

  async newChannelEntry ({ channel, entry }) {
    const { headers } = this
    return useFetch.put("api/channels/" + channel.id, { channel, entry }, { headers })
  }

  async createTask (taskSettings) {
    const { headers } = this
    return useFetch.post("api/tasks", taskSettings, { headers })
  }

  async getCompany (id) {
    const { headers } = this
    return useFetch.get("api/companies/" + id, { headers }) 
  }

  async loginWithProvider ({ provider, access_token }) {
    return useFetch.get(`/api/auth/${provider}/callback?access_token=${access_token}`) 
  }

  async updateNetwork (settings) {
    const { headers } = this
    return useFetch.put("/api/networks/1", settings, { headers })
  }

  async createSnapshot (snapshotSettings) {
    const { headers } = this
    return useFetch.post("api/snapshots", snapshotSettings, { headers })
  }

  async reloadClinic (id) {
    const { headers } = this
    return useFetch.get(`api/neko-rooms/${id}/reload`, { headers })
  }

  async findPeople (search) {
    const { headers } = this
    return useFetch.get(`api/users?q=` + search, { headers })
  }
}

export default new Strapi()
