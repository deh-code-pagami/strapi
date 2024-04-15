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

function prepareData(data) {
  if (!data) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(el => prepareData(el));
  }

  data.attributes.users.data = data.attributes.users.data.map(sub => sub.attributes.user);

  return data;
}

function prepareResult(result) {
  if (!result) {
    return result;
  }

  result.data = prepareData(result.data);

  return result;
}

module.exports = createCoreController('api::group.group', {

  async find(ctx) {
    setPopulatedFields(ctx);

    ctx.query.filters = {
      users: {
        user: ctx.state.user?.id
      }
    }

    return prepareResult(await super.find(ctx));
  },

  async findOne(ctx) {
    setPopulatedFields(ctx);

    const result = await super.findOne(ctx);

    const members = result?.data?.attributes?.users?.data?.map(subscription => subscription.attributes.user.data.id);

    if (!members?.includes(ctx.state?.user?.id)) {
      return ctx.notFound();
    }

    return prepareResult(result);
  },

  async create(ctx) {
    setPopulatedFields(ctx);

    const result = await super.create(ctx);

    const subscription = await strapi.entityService.create('api::group-user.group-user', {
      data: {
        user: ctx.state.user?.id,
        group: result.data.id,
        publishedAt: Date.now()
      },
      populate: ['group', 'user']
    });

    strapi.log.info(`group ${subscription.group.id} created by user ${subscription.user.id}`);

    return prepareResult(result);
  },

  async deleteUser(ctx) {
    const { groupId, userId } = ctx.params;

    let subscriptions = await strapi.entityService.findMany('api::group-user.group-user', {
      filters: {
        user: userId,
        group: groupId
      }
    });

    const deleteSubscriptions = subscriptions.map(sub => strapi.entityService.delete('api::group-user.group-user', sub.id))
    await Promise.all(deleteSubscriptions);

    subscriptions = await strapi.entityService.findMany('api::group-user.group-user', {
      filters: {
        group: groupId
      }
    });

    if (!subscriptions.length) {
      await strapi.entityService.delete('api::group.group', groupId);
    }

    return {
      data: subscriptions
    }
  }
});
