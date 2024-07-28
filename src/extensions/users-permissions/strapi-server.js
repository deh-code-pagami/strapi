("use strict");

module.exports = (plugin) => {
  // append custom controllers
  plugin.controllers['logout'] = require('./controllers/logout');

  // append custom routes
  plugin.routes["content-api"].routes.push({
    method: 'POST',
    path: '/logout',
    handler: 'logout.index',
    config: {
      middlewares: [ 'plugin::users-permissions.rateLimit' ],
      prefix: ''
    }
  });

  // append custom middlewares
  plugin.routes["content-api"].routes = plugin.routes["content-api"].routes.map(
    (item) => {
      if (item.method == "POST" && item.path == "/auth/local") {
        if (!Array.isArray(item.config.middlewares)) {
          item.config.middlewares = []
        }

        item.config.middlewares.push("global::cookieJWT");
      } else if (item.method == "GET" && item.path == "/users/me") {
        if (!Array.isArray(item.config.middlewares)) {
          item.config.middlewares = []
        }

        item.config.middlewares.push("global::setMe");
      }

      return item;
    }
  );

  return plugin;
};
