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

      const res = ctx.response;

      res.body.role = ctx.state.user.role.name;
  }
}
