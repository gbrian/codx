module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/neko-rooms/proxy',
      handler: 'neko-room.proxy',
    },
    {
      method: 'DELETE',
      path: '/neko-rooms/:id',
      handler: 'neko-room.delete',
    },
    {
      method: 'POST',
      path: '/neko-rooms',
      handler: 'neko-room.create',
    },
    {
      method: 'GET',
      path: '/neko-rooms/:id/reload',
      handler: 'neko-room.reload',
    }
  ]
}