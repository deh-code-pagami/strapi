module.exports = {
  async assignDefaultPermissions() {
    const authenticatedRole = (
      await strapi.entityService.findMany("plugin::users-permissions.role", {
        filters: {
          name: "Authenticated",
        },
        populate: ["permissions"],
      })
    )[0];

    const authenticatedDefaultPermissions = [
      "api::group.group.find",
      "api::group.group.findOne",
      "api::group.group.create",
      "api::group.group.deleteUser",
      "api::group.group.update",
      "api::group.group.delete",
      "api::group-user.group-user.findOne",
      "api::group-user.group-user.find",
      "api::group-user.group-user.create",
      "api::group-user.group-user.update",
      "api::group-user.group-user.delete",
      "api::transaction.transaction.find",
      "api::transaction.transaction.findOne",
      "api::transaction.transaction.create",
      "api::transaction.transaction.update",
      "api::transaction.transaction.delete",
      "api::transaction-meta.transaction-meta.find",
      "api::transaction-meta.transaction-meta.findOne",
      "api::transaction-meta.transaction-meta.create",
      "api::transaction-meta.transaction-meta.update",
      "api::transaction-meta.transaction-meta.delete",
      "plugin::users-permissions.user.me",
      "plugin::users-permissions.user.find",
      "plugin::users-permissions.user.findOne",
      "plugin::users-permissions.role.find",
      "plugin::users-permissions.role.findOne",
      "plugin::users-permissions.logout.index",
    ];

    const permissions = await strapi
      .plugin("users-permissions")
      .service("users-permissions")
      .getActions();

    for (const [groupName, group] of Object.entries(permissions)) {
      for (const [controllerName, controller] of Object.entries(
        group.controllers
      )) {
        for (const [actionName, action] of Object.entries(controller)) {
          const permissionUID = `${groupName}.${controllerName}.${actionName}`;

          if (
            authenticatedDefaultPermissions.includes(permissionUID) ||
            authenticatedRole.permissions.find(
              (perm) => perm.action === permissionUID
            )
          ) {
            action.enabled = true;
          }
        }
      }
    }

    await strapi
      .plugin("users-permissions")
      .service("role")
      .updateRole(authenticatedRole.id, {
        name: authenticatedRole.name,
        description: authenticatedRole.description,
        permissions,
      });
  }
}
