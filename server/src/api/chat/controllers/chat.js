'use strict';

/**
 *  chat controller
 */
 const uuid = require('uuid').v4;
 const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::chat.chat', ({ strapi }) => ({
  async create (ctx) {
    const { params: { name }, request: { body } } = ctx
    const data = {
      ...body,
      admins: [ctx.state.user],
      name,
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
    const { request: { body: { guest, admin } }} = ctx
    const { guests = [], admins } = await strapi.$api('chat').findOne(id, { populate: { admins: true, guests: true } })
    const data = {}
    if (guest) {
      data.guests = [...guests, guest]
      strapi.$api('network').update({ data: { user: guest, friends: data.guests.concat(data.admins) }})
    } 
    if (admin) {
      data.admins = [...admins, admin]
      strapi.$api('network').update({ data: { user: admin, friends: data.guests.concat(data.admins) }})
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
