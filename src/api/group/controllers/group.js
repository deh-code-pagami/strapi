'use strict';

/**
 * group controller
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
      users: {
        populate: {
          user: true
        }
      },
      transactions: {
        populate: {
          transaction_meta: true
        }
      }
    }
  };
}

module.exports = createCoreController('api::group.group', {

  async find(ctx) {
    setPopulatedFields(ctx);

    ctx.query.filters = {
      users: {
        user: ctx.state.user?.id
      }
    }

    return await super.find(ctx);
  },

  async findOne(ctx) {
    setPopulatedFields(ctx);

    const result = await super.findOne(ctx);

    const members = result?.data?.attributes?.users?.data?.map(subscription => subscription.attributes.user.data.id);

    if (!members?.includes(ctx.state?.user?.id)) {
      return ctx.notFound();
    }

    return result;
  },

  async create(ctx) {
    setPopulatedFields(ctx);

    const group = await super.create(ctx);

    const subscription = await strapi.entityService.create('api::group-user.group-user', {
      data: {
        user: ctx.state.user?.id,
        group: group.data.id,
        publishedAt: Date.now()
      },
      populate: ['group', 'user']
    });

    strapi.log.info(`group ${subscription.group.id} created by user ${subscription.user.id}`);

    return group;
  }
});
