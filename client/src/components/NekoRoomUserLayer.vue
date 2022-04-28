<template>
  <div ref="userLayer" style="position:relative;witdh:100%;height:100%">
    <div
      :style="{
        display: 'flex',
        position: 'absolute',
        top: `${user.cursor?.y}px`,
        left: `${user.cursor?.x}px`,
        padding: '6px',
        borderRadius: '10px',
        backgroundColor: 'black'
      }"
      v-for="(user, ix) in onlineUsers" :key="ix">
        <CursorClickIcon
          :style="{
            width: '18px'
          }"
        />
        <div style="margin-left:4px">{{ user.username }}</div>
    </div>
  </div>
</template>
<script>
import { CursorClickIcon } from '@heroicons/vue/solid'
export default {
  components: {
    CursorClickIcon
  },
  props: ['storex'],
  computed: {
    users () {
      const users = this.storex.network.friends
      return Object.keys(users)
                    .map(k => users[k])
    },
    onlineUsers () {
      const { userLayer } = this.$refs
      const chatId = $storex.clinic.currentClinic?.chat.id
      return this.users
              .filter(u => !!u.clinic?.cursorPosition &&
                u.clinic?.currentClinicChatId === chatId)
              .map(u => {
                if (userLayer) {
                  const { clinic: { cursorPosition: { px, py } } } = u
                  u.cursor = {
                    x: Math.floor(userLayer.clientWidth / 100 * px),
                    y: Math.floor(userLayer.clientHeight / 100 * py)
                  }
                }
                return u
              })
    }
  }
}
</script>