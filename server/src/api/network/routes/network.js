'use strict';

/**
 * network router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const basicRoutes = createCoreRouter('api::network.network');
/*
const { routes } = basicRoutes
routes.push(
  { 
    method: 'GET',
    path: 'networks/people', 
    handler: 'network.people'
  })
*/
module.exports = basicRoutes
