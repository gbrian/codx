'use strict';

/**
 *  clinic-template controller
 */

 const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::clinic-template.clinic-template', ({ strapi }) => ({
  async find () {
    return await strapi.$query('clinic-template').findMany({ populate: { user: true, sponsor: true } })
  }
}));
