/**
 * @param {string} entity
 * @returns
 */
function getPopulateFields(entity) {
  switch (entity) {
    case 'groups':
      return {
        users: { populate: getPopulateFields('group-users') },
        transactions: { populate: getPopulateFields('transactions') }
      };
    case 'transactions':
      return {
        group: true,
        transactionMetas: { populate: getPopulateFields('transaction-metas') }
      }
    case 'group-users':
      return {
        user: true
      }
    case 'transaction-metas':
      return {
        userCreditor: true,
        userDebtor: true
      }
  }

  return null;
}

/**
 * Automatically set fields to populate for the given entity, based on the api name
 * @returns {(cxt: import("koa").Context, next: function) => any }
 */
module.exports = () => {
  return (ctx, next) => {
    const entity = ctx.request.path.match(/api\/([^/]+)/)?.[1];
    const populatedFields = getPopulateFields(entity);

    if (populatedFields) {
      ctx.query.populate = populatedFields;
    }

    return next();
  }
}
