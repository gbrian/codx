'use strict';

/**
 * snapshot router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::snapshot.snapshot');
