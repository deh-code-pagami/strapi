/**@typedef {import('@strapi/strapi').Common.UID.ContentType} ContentType */


/**@param {ContentType} uid  */
function getDefaultQuery(uid, ctx = {}) {
  /**@type {Object.<ContentType, Object>} */
  switch (uid) {
    case 'api::group.group':
      return {
        populate: {
          users: getDefaultQuery('api::group-user.group-user', ctx),
          transactions: getDefaultQuery('api::transaction.transaction', ctx),
        },
        filters: {
          users: {
            user: ctx.state.user?.id
          }
        }
      };
    case 'api::transaction.transaction':
      return {
        group: true,
        filters: {
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
        },
        populate: {
          transactionMetas: getDefaultQuery('api::transaction-meta.transaction-meta', ctx)
        }
      }
    case 'api::group-user.group-user':
      return {
        populate: {
          user: true
        }
      }
    case 'api::transaction-meta.transaction-meta':
      return {
        populate: {
          userCreditor: true,
          userDebtor: true
        }
      }
  }

  return {};
}

module.exports = {
  /**
   * @param {ContentType} uid
   * @returns {Object}
   */
  getDefaultQuery
}
