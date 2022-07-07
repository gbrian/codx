'use strict';

/**
 *  chat controller
 */
 const uuid = require('uuid').v4;
 const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::chat.chat', ({ strapi }) => ({
  async create (ctx) {
    const { request: { body } } = ctx
    const data = {
      ...body,
      admins: [ctx.state.user],
      name: (body.name || "").replace(/[^a-zA-Z0-9@\-]/g, "_"),
      roomId: `${uuid()}`
    }
    const { id } = await strapi.$api('chat').create({ data })
    if (body.clinicId) {
      await strapi.$api("neko-room").update(body.clinicId, { data: { chat: id }})
    }
    return this.findOne({ ...ctx, params: { id }})
  },
  async findOne ({ state: { user }, params: { id } }) {
    const chat = await strapi.$api('chat').findOne(id, { populate: { admins: true, guests: true } })
    const { admins, guests = [], readReceipt } = chat
    if (!admins.concat(guests).find(u => u.id === user.id)) {
      throw new Error("User can't access this chat: " + { userid: user.id, chatId: id })
    }
    chat.readReceipt = Object.assign({}, readReceipt, { [user.id]: new Date() })
    await strapi.$api("chat").update(id, { data: {
      readReceipt: chat.readReceipt
    }})
    const messages = await strapi.$query('chat-message').findMany({
      filters: { chat: id },
      populate: { from: true }
    })
    return {
      ...chat,
      messages
    }
  },
  async update (ctx) {
    const { id } = ctx.params
    const { state: { user }, request: { body: { guest, admin, name } }} = ctx
    const { guests = [], admins } = await strapi.$api('chat').findOne(id, { populate: { admins: true, guests: true } })
    if (!admins.filter(a => a.id === user.id)[0]) {
      throw new Error("Not allowed")
    }
    const data = {
      guests,
      admins
    }
    if (guest) {
      guests.push(guest)
    } 
    if (admin) {
      admins.push(admin)
    }
    strapi.$api('network').makeFriends([...data.guests, ...data.admins])
    if (name) {
      data.name = name
    }
    return await strapi.$api('chat').update(id, { data })
  },
  async delete (ctx) {
    const { state: { user }, params: { id }, request: { query } } = ctx
    const { guests = [], admins } = await strapi.$api('chat').findOne(id, { populate: { admins: true, guests: true } })
    const isAdmin = admins.filter(a => a.id === user.id)[0]
    const removeUser = isAdmin ? query.removeUser : guests.filter(a => a.id === user.id)[0]?.id
    if (removeUser) {
      const uid = parseInt(removeUser)
      const data = {
        guests: guests.filter(u => u.id !== uid).map(u => u.id), 
        admins: admins.filter(u => u.id !== uid).map(u => u.id), 
      }
      return await strapi.$api('chat').update(id, { data })
    }
    strapi.io.emit('chat-delete', { id }, admins.concat(guests).map(u => u.id))
    return super.delete(ctx)
  }
}));
