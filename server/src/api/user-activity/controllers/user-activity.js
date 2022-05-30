'use strict';

/**
 *  user-activity controller
 */

 const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::user-activity.user-activity', ({ strapi }) => ({
  async create (ctx) {
    const { state: { user }, request: { body: { timestamp, event } } } = ctx
    return strapi.$api('user-activity').create({
        user,
        timestamp,
        event
    }) 
  }
}))
