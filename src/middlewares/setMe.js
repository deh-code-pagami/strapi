// @ts-nocheck

/**
 * Insert role inside the response sent by "api/auth/me/" endpoint
 * @returns {(cxt: import("koa").Context, next: function) => any }
 */
module.exports = () => {
  return async ( ctx, next) => {
      await next();

      if (ctx.status != 200) {
        return;
      }

      const res = ctx.response;

      res.body.role = ctx.state.user.role.name;
  }
}
