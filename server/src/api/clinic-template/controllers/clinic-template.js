'use strict';

/**
 *  clinic-template controller
 */

 const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::clinic-template.clinic-template', ({ strapi }) => ({
  async create ({ state: { user }, request: { body }}) {
    const nekoRoom = await strapi.$query('neko-room').findMany({
      filters: { id: body.clinicId },
    })
    const {
      settings: { cloudProvider: { settings } },
      room: { neko: { id: roomId } } 
    } = nekoRoom[0]
    const snapshot = await strapi.$codx.room.createSnapshot({ nekoRoomsProvider: settings, roomId })
    console.log("Container create snapshot", snapshot, roomId)
    return strapi.$query('clinic-template').create({ data: {
      ...body,
      user,
      image: snapshot.name
    }})
  },
  async find ({ state: { user }}) {
    const privateClinics = user ? strapi.$query('clinic-template').findMany({
      where: {
        visibility: { $not: 'public' },
        user: user.id
      },
      populate: { user: true, sponsor: true }
    }) : Promise.resolve([])
    const publicClinics = strapi.$query('clinic-template').findMany({
      where: {
        visibility: 'public',
      },
      populate: { user: true, sponsor: true } 
    })
    const all = await Promise.all([privateClinics, publicClinics])
    return all.reduce((a, b) => a.concat(b))
  }
}));
