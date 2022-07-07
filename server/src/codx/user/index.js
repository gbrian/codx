const channel = require("../../api/channel/controllers/channel")

module.exports = strapi => {
  return {
    filteredUser ({ avatar, blocked, email, id, username }) {
      return { avatar, blocked, email, id, username }
    },
    async network (user) {
      const networks = await strapi.$query('network').findMany({ 
        filters: { user: user.id },
        populate: { friends: true, following: true, followed: true }
      })
      const network = networks[0] || { friends: [], following: [], followed: [] }
      return {
        id: network.id,
        friends: network.friends.map(this.filteredUser),
        following: network.following.map(this.filteredUser),
        followed: network.followed.map(this.filteredUser),
      }
    },
    async subscriptions (companies = []) {
      const paidSubs = companies
                        .filter(({ settings }) => !!settings?.rooms)
                        .map(({ id, settings: { rooms } }) => ({
                          company: id,
                          subscription: rooms
                        }))
      const freeSubs = await strapi.$query('subscription').findMany({
        filters: { free: true }
      })
      return [
        {
          personal: true,
          subscription: freeSubs.map(({ settings: { rooms: subscription } }) => subscription)
            .reduce((a,b ) => a.concat(b), [])
        },
        ...paidSubs
      ]
    },
    async channels ({ id }) {
      return strapi.$api('channel').findMany({
        filters: {
          $or: [
            { users: [id] },
            { user: [id] }
          ]
        }
      })
    },
    async findUserByName (username) {
      const users = await strapi.$query("users-permissions.user").findMany({
        filters: {
          username
        }
      })
      return users[0]
    },
    async findUser (id) {
      return strapi.$query("users-permissions.user").findOne(id)
    },
    async findPeople (search) {
      const users = await strapi.$query("users-permissions.user").findMany({
        filters: {
          $or: [
            {
              username: {
                $contains: search
              },
            },
            {
              email: {
                $contains: search
              }
            }
          ]
        }
      })
      return users.map(this.filteredUser)
    },
    async me (params) {
      const { id } = params
      const sme = await this.findUser(id)
      const network = await this.network(sme)
      const guestChats = await strapi.$query('chat').findMany({ 
        filters: { guests: [sme.id] },
        populate: { admins: true, guests: true, channel: { entries: true } }
      })
      const adminChats = await strapi.$query('chat').findMany({ 
        filters: { admins: [sme.id] },
        populate: { admins: true, guests: true, channel: { entries: true } }
      })
      const clinics = await strapi.codx.room.listRooms(sme)
      const companies = await strapi.codx.company.companies(sme)
      const subscriptions = await this.subscriptions(companies)
      const ds = new Date().getTime()
      const channels = await this.channels(sme)
      const channelChats = channels
                          .map(({ entries }) => entries
                              .map(({ chat_message: { chat: { id } } = { chat: {} } }) => id ))
                          .reduce((a, b) => a.concat(b), [])
      const chats = [...guestChats, ...adminChats].map(c => ({ ...c, isChannel: channelChats.indexOf(c.id) !== -1 }))
      const activity = await strapi.$query('user-activity').findMany({ 
        filters: { user: id }
      })
      return {
        ...this.filteredUser(sme),
        roomId: `@${sme.username}`,
        session: {},
        network,
        subscriptions,
        chats,
        channels,
        clinics,
        companies,
        credits: sme.credits,
        statistics: sme.statistics,
        activity,
        contentCreator: sme.contentCreator
      }
    },
    async updateUserStatistics (userId, data) {
      const { statistics: currentStatistics } = await this.findUser(userId)
      const statistics = Object.assign(currentStatistics ||  {}, data)
      await strapi.$query("users-permissions.user").update(userId, { data: { statistics } })
      return statistics
    }
  }
}