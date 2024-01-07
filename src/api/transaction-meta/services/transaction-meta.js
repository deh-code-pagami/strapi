'use strict';

/**
 * transaction-meta service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::transaction-meta.transaction-meta');
