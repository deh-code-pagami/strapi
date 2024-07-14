'use strict';

/**
 * group-user controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::group-user.group-user', {

  async findOne(ctx) {
    const result = await super.findOne(ctx);

    const userId = result?.data?.attributes?.user?.data?.id;

    if (userId !== ctx.state?.user?.id) {
      return ctx.notFound();
    }

    return result;
  },
});
