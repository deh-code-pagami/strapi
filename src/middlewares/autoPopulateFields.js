/**
 * @param {string} entity
 * @param {boolean} isForDetail
 * @returns
 */
function getPopulateFields(entity, isForDetail) {
  switch (entity) {
    case 'groups':
      return isForDetail ?
        {
          users: { populate: getPopulateFields('group-users', isForDetail) },
          transactions: { populate: getPopulateFields('transactions', isForDetail) }
        } :
        {};
    case 'transactions':
      return {
          group: true,
          transactionMetas: { populate: getPopulateFields('transaction-metas', isForDetail) }
        };
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
    const [ _match, entity, id ] = ctx.request.path.match(/^\/api\/([^/]+)\/?([^/]+)?/) || [];
    const isForDetail = !!id

    const populatedFields = getPopulateFields(entity, isForDetail);

    if (populatedFields) {
      ctx.query.populate = populatedFields;
    }

    return next();
  }
}
