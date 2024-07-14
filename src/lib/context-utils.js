/**@typedef {import('@strapi/strapi').Common.UID.ContentType} ContentType */

function isObject (obj)  {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * Strips data and attributes fields from strapi API response
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
  normalizeData,
  isObject
}
