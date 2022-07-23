'use strict';
const session = require("koa-session2")
const ioManager = require('./io')
const { injectApi } = require('./api/strapix')

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    strapi.io = new ioManager(strapi)
    strapi.server.use(session({
      secret: "grant",
    }))
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    injectApi({ strapi })
    // https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#hook-event-object
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async beforeCreate(event) {
      },
      async afterCreate(event) {
        const { result: { id } } = event
        // User intialization
        await strapi.$api('network').create({ data: {
          user: [ id ]
        }})
      },
      async beforeDelete (event) {
        const id = event.params.where.id;
        const [network] = await strapi.$query('network').findMany({ filters: {
          user: id
        }})
        if (network) {
          // User intialization
          await strapi.$api('network').delete(network.id)
        }
      }
    });
  },
};
