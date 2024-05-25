module.exports = {
  async beforeDelete(event) {
    const { params } = event;

    const groupId = params?.where?.id;

    if (!groupId) {
      return;
    }

    const relatedSubscription = await strapi.entityService.findMany('api::group-user.group-user', {
      filters: {
        group: groupId
      }
    });

    const deletedSubscriptions = await Promise.all(
      relatedSubscription.map(sub => strapi.entityService.delete('api::group-user.group-user', sub.id))
    );

    strapi.log.info(`subscription removed: [${deletedSubscriptions.map(sub => sub.id).join(', ')}]`);
  },
}
