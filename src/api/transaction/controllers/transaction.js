'use strict';

/**
 * transaction controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::transaction.transaction', {

  async find(ctx) {
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

    const result = await super.findOne(ctx);

    let currentUserCan = false;
    const metas = result?.data?.attributes?.transactionMetas?.data;
    const userId = ctx.state?.user?.id;

    if (!Array.isArray(metas) || !userId) {
      return ctx.notFound();
    }

    for (const meta of metas) {
      if (meta.attributes?.userCreditor.data.id === userId) {
        currentUserCan = true;
        break;
      }

      if (meta.attributes?.userDebtor.data.id === userId) {
        currentUserCan = true;
        break;
      }
    }

    if (!currentUserCan) {
      return ctx.notFound();
    }


    return result;
  },

  async create(ctx) {
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
    };

    const data = ctx.request.body.data;

    if (data.transactionMetas?.length) {
      data.transactionMetas = await Promise.all(
        data.transactionMetas.map(transactionMeta =>
          strapi.entityService.create('api::transaction-meta.transaction-meta', {
            data: {
              ...transactionMeta,
              publishedAt: Date.now()
            }
          }))
        )
    }

    return await super.create(ctx);
  }
});
