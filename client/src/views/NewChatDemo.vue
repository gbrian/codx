<template>
  <chat-window
    :current-user-id="me.id"
    :rooms="rooms"
    :messages="messages"
    @fetch-messages="fetchMessages"
  />
</template>

<script>
import ChatWindow from "vue-advanced-chat";
import "vue-advanced-chat/dist/vue-advanced-chat.css";

export default {
  components: {
    ChatWindow,
  },
  data() {
    return {
      rooms: [],
      messages: []
    };
  },
  mounted () {
    const chats = Object.values(this.$storex.chat.chats)
    this.rooms = chats.map((chat, index) => {
      const { id, chatName, users } = chat
      return Object.assign({}, {
          id,
          roomId: id,
          roomName: chatName,
          users: users.map(u => Object.assign({}, u, { _id: u.id })),
          index,
          avatar: "assets/imgs/people.png",
          unreadCount: index,
        })
    })
  },
  computed: {
    me() {
      return this.$storex.user.user;
    },
  },
  methods: {
    async fetchMessages({ room, options }) {
      if (room.id !== $storex.chat.openedChat?.id) {
        await $storex.chat.openChat(room)
      }
      this.messages = $storex.chat.openedChat.messages.map(this.prepareMessage)
    },
    prepareMessage (msg) {
      const { id, content, from } = msg
      return {
        _id: id,
        // indexId: 12092,
        content,
        senderId: from.id,
        username: from.username,
        avatar: from.avatar,
        date: '13 November',
        timestamp: '10:20',
        system: false,
        saved: true,
        distributed: true,
        seen: true,
        deleted: false,
        failure: false,
        disableActions: false,
        disableReactions: false,
      }
    }
  },
};
</script>