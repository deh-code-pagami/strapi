'use strict';

const { getDefaultQuery, normalizeData } = require('../../../lib/context-utils');

/**
 * group controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

function prepareData(data) {
  if (!data) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(el => prepareData(el));
  }

  data.users = data.users?.map(sub => sub.user);

  return data;
}

module.exports = createCoreController('api::group.group', {
  /**@param {import('koa').Context} ctx  */
  async find(ctx) {
    ctx.query = getDefaultQuery('api::group.group', ctx);

    const result = await super.find(ctx);

    result.data = normalizeData(result.data);

    prepareData(result.data);

    return result;
  },

  /**@param {import('koa').Context} ctx  */
  async findOne(ctx) {
    ctx.query = getDefaultQuery('api::group.group', ctx);

    const result = await super.findOne(ctx);

    result.data = normalizeData(result.data);

    const members = result.data?.users?.map(subscription => subscription.user.id);

    if (!members?.includes(ctx.state?.user?.id)) {
      return ctx.notFound();
    }

    prepareData(result.data);

    return result;
  },

  async create(ctx) {
    ctx.query = getDefaultQuery('api::group.group', ctx);

    const result = await super.create(ctx);

    result.data = normalizeData(result.data);

    const subscription = await strapi.entityService.create('api::group-user.group-user', {
      data: {
        user: ctx.state.user?.id,
        group: result.data.id,
        publishedAt: Date.now()
      },
      populate: ['group', 'user']
    });

    result.data.users?.push(subscription);

    strapi.log.info(`group ${subscription.group.id} created by user ${subscription.user.id}`);

    prepareData(result?.data);

    return result;
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
      },
      populate: {
        user: true
      }
    });

    if (!subscriptions.length) {
      await strapi.entityService.delete('api::group.group', groupId);
    }

    return {
      data: subscriptions.map(sub => sub.user)
    }
  }
});
