'use strict';

const { getPopulatedFields } = require('../../../lib/context-utils');

/**
 * transaction controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::transaction.transaction', {

  async find(ctx) {
    ctx.query = getPopulatedFields('api::transaction.transaction');

    ctx.query.filters = {
      transactionMetas: {
        $or: [
          {
            userDebtors: ctx.state.user?.id
          },
          {
            userCreditor: ctx.state.user?.id
          }
        ]
      }
    }

    return await super.find(ctx);
  },

  async findOne(ctx) {
    ctx.query = getPopulatedFields('api::transaction.transaction');

    const result = await super.findOne(ctx);
    const userIds = result?.data?.attributes?.transactionMetas?.data?.map(meta => ([meta?.attributes?.userDebtors?.data?.id, meta?.attributes?.userCreditor?.data?.id]));

    if (!userIds?.flat().includes(ctx.state?.user?.id)) {
      return ctx.notFound();
    }

    return result;
  },

  async create(ctx) {
    ctx.query = getPopulatedFields('api::transaction.transaction');
    const data = ctx.request.body.data;

    if (data.transactionMetas?.length) {
      data.transactionMetas = await Promise.all(
        data.transactionMetas.map(transactionMeta =>
          strapi.entityService.create('api::transaction-meta.transaction-meta', { data: transactionMeta }))
        )
    }

    return await super.create(ctx);
  }
});
