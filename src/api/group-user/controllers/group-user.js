'use strict';

/**
 * group-user controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

/**
 * @param {import('koa').Context} ctx
 */
function setPopulatedFields(ctx) {
  const user = ctx.state?.user;

  if (!user) {
    return;
  }

  ctx.query = {
    populate: {
      user: true
    }
  };
}

module.exports = createCoreController('api::group-user.group-user', {

  async find(ctx) {
    setPopulatedFields(ctx);

    ctx.query.filters = {
      user: ctx.state.user?.id
    }

    return await super.find(ctx);
  },

  async findOne(ctx) {
    setPopulatedFields(ctx);

    const result = await super.findOne(ctx);

    const userId = result?.data?.attributes?.user?.data?.id;

    if (userId !== ctx.state?.user?.id) {
      return ctx.notFound();
    }

    return result;
  },
});
