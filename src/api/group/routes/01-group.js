module.exports = {
  routes: [
    {
      method: 'DELETE',
      path: '/groups/:groupId/user/:userId',
      handler: 'group.deleteUser',
    },
  ]
}
