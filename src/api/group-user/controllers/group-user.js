'use strict';

const { getDefaultQuery } = require('../../../lib/context-utils');

/**
 * group-user controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::group-user.group-user', {

  async find(ctx) {
    ctx.query = getDefaultQuery('api::group-user.group-user', ctx);

    return await super.find(ctx);
  },

  async findOne(ctx) {
    ctx.query = getDefaultQuery('api::group-user.group-user', ctx);

    const result = await super.findOne(ctx);

    const userId = result?.data?.attributes?.user?.data?.id;

    if (userId !== ctx.state?.user?.id) {
      return ctx.notFound();
    }

    return result;
  },
});
