// @ts-nocheck
const cookie = require('cookie');

module.exports = () => {
  return async (
    /**@type {import("koa").Context} */ ctx,
    next) => {
      const req = ctx.request;
      const jwt = cookie.parse(req.header.cookie || '').auth_jwt;

      if (jwt) {
        req.header.authorization = 'Bearer ' + jwt;
      }

      await next();
  }
}
