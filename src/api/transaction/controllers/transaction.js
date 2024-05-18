'use strict';

/**
 * transaction controller
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
      group: true,
      transactionMetas: {
        populate: {
          userDebtor: true,
          userCreditor: true
        }
      }
    }
  };
}

module.exports = createCoreController('api::transaction.transaction', {

  async find(ctx) {
    setPopulatedFields(ctx);

    ctx.query.filters = {
      transactionMetas: {
        $or: [
          {
            userDebtor: ctx.state.user?.id
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
    setPopulatedFields(ctx);

    const result = await super.findOne(ctx);
    const userIds = result?.data?.attributes?.transactionMetas?.data?.map(meta => ([meta?.attributes?.userDebtor?.data?.id, meta?.attributes?.userCreditor?.data?.id]));

    if (!userIds?.flat().includes(ctx.state?.user?.id)) {
      return ctx.notFound();
    }

    return result;
  },

  async create(ctx) {
    setPopulatedFields(ctx);
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
