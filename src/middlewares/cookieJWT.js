// @ts-nocheck
module.exports = () => {
  return async (
    /**@type {import("koa").Context} */ ctx,
    next) => {
    await next();

    const res = ctx.response
    if (!res.body?.jwt) {
      return;
    }

    let setCookie = res.header["set-cookie"];
    const jwtCookie = `auth_jwt=${res.body.jwt}; Path=/api; HttpOnly`;

    if (Array.isArray(setCookie)) {
      setCookie.push(jwtCookie);
    }
    else {
      setCookie = [jwtCookie];
    }

    delete(res.body.jwt)
    res.set("Set-Cookie",setCookie );
  }
}
