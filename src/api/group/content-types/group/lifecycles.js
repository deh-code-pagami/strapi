module.exports = {
  async beforeDelete(event) {
    const { params } = event;

    const groupId = params?.where?.id;

    if (!groupId) {
      return;
    }

    const deleteSubscriptions = async () => {
      const relatedSubscriptions = await strapi.entityService.findMany('api::group-user.group-user', {
        filters: {
          group: groupId
        }
      });

      const deletedSubscriptions = await Promise.all(
        relatedSubscriptions
          .map(sub => strapi.entityService.delete('api::group-user.group-user', sub.id))
      );

      strapi.log.info(`subscriptions removed for group ${groupId}: [${deletedSubscriptions.map(sub => sub.id).join(', ')}]`);
    }

    const deleteTransactions = async () => {
      const relatedTransactions = await strapi.entityService.findMany('api::transaction.transaction', {
        filters: {
          group: groupId
        }
      });

      const deletedTransactions = await Promise.all(
        relatedTransactions
          .map(tr => strapi.entityService.delete('api::transaction.transaction', tr.id))
      );

      strapi.log.info(`transactions removed for group ${groupId}: [${deletedTransactions.map(tr => tr.id).join(', ')}]`);
    }

    await Promise.all([deleteSubscriptions(), deleteTransactions()]);
  },
}
