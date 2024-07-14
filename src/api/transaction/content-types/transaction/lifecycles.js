module.exports = {
  async beforeDelete(event) {
    const { params } = event;

    const transactionId = params?.where?.id;

    if (!transactionId) {
      return;
    }

    const relatedMetas = (await strapi.entityService.findOne('api::transaction.transaction', transactionId, {
        populate: ['transactionMetas']
      }))
      .transactionMetas || [] ;

    const deletedMetas = await Promise.all(
      relatedMetas
        .map(meta => strapi.entityService.delete('api::transaction-meta.transaction-meta', meta.id))
    );

    strapi.log.info(`metas removed for transaction ${transactionId}: [${deletedMetas.map(sub => sub.id).join(', ')}]`);
  }
}
