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
      transaction_metas: {
        populate: {
          user_debtor: true,
          user_creditor: true
        }
      }
    }
  };
}

module.exports = createCoreController('api::transaction.transaction', {

  async find(ctx) {
    setPopulatedFields(ctx);

    ctx.query.filters = {
      transaction_metas: {
        $or: [
          {
            user_debtor: ctx.state.user?.id
          },
          {
            user_creditor: ctx.state.user?.id
          }
        ]
      }
    }

    return await super.find(ctx);
  },

  async findOne(ctx) {
    setPopulatedFields(ctx);

    const result = await super.findOne(ctx);
    const userIds = result?.data?.attributes?.transaction_metas?.data?.map(meta => ([meta?.attributes?.user_debtor?.data?.id, meta?.attributes?.user_creditor?.data?.id]));

    if (!userIds?.flat().includes(ctx.state?.user?.id)) {
      return ctx.notFound();
    }

    return result;
  },
});
