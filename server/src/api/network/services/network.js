'use strict';

/**
 * network service.
 */
const { createCoreService } = require('../../strapix')

module.exports = createCoreService('api::network.network', ({ strapi }) => ({
  async makeFriends (users) {
    users.forEach(async user => {
      const [myNetwork] = await strapi.$query('network').findMany({ filters: { user: user.id }, populate: [ 'friends' ] })
      const newFriends = users.filter(u => u.id !== user.id && !myNetwork.friends.some(f => f.id === u.id))
      if (newFriends.length) {
        strapi.$api('network').update(myNetwork.id, { data: { friends: [...myNetwork.friends, ...newFriends] } })
      }
    })
  }
}));