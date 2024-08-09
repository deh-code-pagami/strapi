module.exports = {
  routes: [
    {
      method: 'DELETE',
      path: '/groups/:groupId/users/:userId',
      handler: 'group.deleteUser',
    },
  ]
}
