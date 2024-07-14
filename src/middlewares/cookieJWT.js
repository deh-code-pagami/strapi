// @ts-nocheck

/**
 * Set jwt for the authenticated user in the response's cookie. This prevent the jwt from being accessed by frontend javascript
 * @returns {(cxt: import("koa").Context, next: function) => any }
 */
module.exports = () => {
  return async (ctx, next) => {

    await next();

    const res = ctx.response

    let setCookie = res.header["set-cookie"];
    const jwtCookie = `auth_jwt=${res.body?.jwt || ''}; Path=/api; HttpOnly`;

    if (Array.isArray(setCookie)) {
      setCookie.push(jwtCookie);
    }
    else {
      setCookie = [jwtCookie];
    }

    delete(res.body?.jwt)
    res.set("Set-Cookie", setCookie);
  }
}
