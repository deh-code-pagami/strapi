/**@typedef {import('@strapi/strapi').Common.UID.ContentType} ContentType */

function isObject (obj)  {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

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

/**
 * @param {Object | Array} data
 * @param {number} deepness
 *
 * @returns {Object}
 */
function normalizeData (data, deepness = 20) {
  if (!deepness || !data) {
    if (!deepness) {
      strapi.log.warn('normalizeData: max deepness has been reached, this might lead to unexpected behavior')
    }

    return data;
  }

  if (Array.isArray(data)) {
    return data.map(el => normalizeData(el, deepness - 1));
  }

  if (!isObject(data.attributes)) {
    return data;
  }

  const attributes = data.attributes;

  delete data.attributes;

  for (const [key, field] of Object.entries(attributes)) {
    if (!isObject(field) || !field.data) {
      data[key] = field;
      continue;
    }

    data[key] = normalizeData(field.data, deepness - 1);
  }

  return data;
}

module.exports = {
  getDefaultQuery,
  normalizeData,
  isObject
}
