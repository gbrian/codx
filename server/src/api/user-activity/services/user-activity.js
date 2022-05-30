'use strict';

/**
 * user-activity service.
 */

 const { createCoreService } = require('../../strapix')

module.exports = createCoreService('api::user-activity.user-activity', ({ strapi }) => ({
  async create ({ user, timestamp, event}) {
    const ts = date.parse(timestamp)
    ts.setSeconds(0)
    /*
    const lastActivity = await strapi.$query('user-activity').findMany({
      filters: {
        user,
        timestamp: ts
      }
    })
    if (lastActivity.length !== 0) {
      const { id, events } = lastActivity[0]
      events.push(event)
      return super().update(id, { data: {
        events
      } })
    }
    return super().create({ data: {
        user,
        timestamp: ts,
        events: [ event ]
      }
    }) */
  }
}))

