'use strict';

/**
 * snapshot service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::snapshot.snapshot');
