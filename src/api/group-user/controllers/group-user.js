'use strict';

const { getPopulatedFields } = require('../../../lib/context-utils');

/**
 * group-user controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::group-user.group-user', {

  async find(ctx) {
    ctx.query = getPopulatedFields('api::group-user.group-user');

    ctx.query.filters = {
      user: ctx.state.user?.id
    }

    return await super.find(ctx);
  },

  async findOne(ctx) {
    ctx.query = getPopulatedFields('api::group-user.group-user');

    const result = await super.findOne(ctx);

    const userId = result?.data?.attributes?.user?.data?.id;

    if (userId !== ctx.state?.user?.id) {
      return ctx.notFound();
    }

    return result;
  },
});
