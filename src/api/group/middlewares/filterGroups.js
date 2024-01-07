// @ts-nocheck
module.exports = () => {
  return async (
    /**@type {import("koa").Context} */ ctx,
    next) => {
      const req = ctx.request;

      req.query.filters =  { users: { user: ctx.state.user.id || 0 } }

      await next();
  }
}
