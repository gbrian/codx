module.exports = strapi => {
  return {
    async status (user) {
      return {
        network: this.network(user),
        statistics: user.statistics
      }
    },
    network (user) {
      const { network: { friends }, chats } = user
      return {
        friends: friends.map(fid => {
          const friend = strapi.io.onlineUsers[fid]
          if (!friend) {
            return null
          }
          const { currentClinicChatId } = friend.clinic || {}
          const openedChat = chats.indexOf(friend.openedChat) !== -1 ? friend.openedChat : null
          return {
            id: fid,  
            online: true,
            openedChat,
            clinic: currentClinicChatId === openedChat ? friend.clinic: null
          }
        }).filter(f => !!f)
      }
    }
  }
}