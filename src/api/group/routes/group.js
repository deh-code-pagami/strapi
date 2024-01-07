'use strict';

/**
 * group router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::group.group', {
  config: {
    create: {
      middlewares: ['global::initializeOwner']
    },
    find: {
      middlewares: ['api::group.filter-groups']
    }
  }
});
