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

      if (jwt && !ctx.state.user) {
        const res = ctx.response;
        let setCookie = res.header["set-cookie"];
        const jwtCookie = `auth_jwt=; Path=/api; HttpOnly`;

        if (Array.isArray(setCookie)) {
          setCookie.push(jwtCookie);
        }
        else {
          setCookie = [jwtCookie];
        }

        res.set("Set-Cookie", setCookie);
      }
  }
}
