/**@typedef {import('@strapi/strapi').Common.UID.ContentType} ContentType */

/**@type {Object.<ContentType, Object>} */
const populatedFields = {
  'api::group.group': {
    populate: {
      users: {
        populate: {
          user: true
        }
      },
      transactions: {
        populate: {
          transactionMetas: {
            populate: {
              userCreditor: true,
              userDebtors: true
            }
          }
        }
      }
    }
  },
  'api::group-user.group-user': {
    populate: {
      user: true
    }
  },
  'api::transaction.transaction': {
    populate: {
      group: true,
      transactionMetas: {
        populate: {
          userDebtors: true,
          userCreditor: true
        }
      }
    }
  },
  'api::transaction-meta.transaction-meta': {},
}

// TODO: use getPopulatedFields inside controllers
module.exports = {
  /**
   * @param {ContentType} uid
   * @returns {Object}
   */
  getPopulatedFields(uid) {
    return populatedFields[uid] || {};
  }
}
