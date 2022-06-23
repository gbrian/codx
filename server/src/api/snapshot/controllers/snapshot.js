'use strict';

/**
 *  snapshot controller
 */

 const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::snapshot.snapshot', ({ strapi }) => {
  const codx = require('../../../codx')(strapi)
  return {
    async create ({ state: { user }, request: { body: { clinic: { id } } } }) {
      const nekoRoom = await strapi.$query('neko-room').findMany({
        filters: { user: user.id, id },
      })
      const {
        settings: { cloudProvider: { settings } },
        room: { neko: { id: roomId } } 
      } = nekoRoom[0]
      const res = await codx.room.createSnapshot({ nekoRoomsProvider: settings, roomId })
      console.log("snapshot", res)
      return {
        roomId,
        res
      }
    }
  }
});
