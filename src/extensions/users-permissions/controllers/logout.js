module.exports = {
  async index(/** @type {import('koa').Context} */ ctx, index) {
    const { response: res } = ctx;

    let setCookie = res.header["set-cookie"];
    const jwtCookie = `auth_jwt=; Path=/api; HttpOnly; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    if (Array.isArray(setCookie)) {
      setCookie.push(jwtCookie);
    }
    else {
      setCookie = [jwtCookie];
    }

    res.set("Set-Cookie", setCookie);
    ctx.body = 'ok';
  }
}
