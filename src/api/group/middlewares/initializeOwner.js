// @ts-nocheck
const cookie = require('cookie');

module.exports = () => {
  return async (
    /**@type {import("koa").Context} */ ctx,
    next) => {
      await next();

      if (ctx.status != 200) {
        return;
      }

      const newEntry = ctx.response.body.data;
      strapi.services['api::group-user.group-user'].create({data: {user: ctx.state.user.id, group: newEntry.id}});
  }
}
