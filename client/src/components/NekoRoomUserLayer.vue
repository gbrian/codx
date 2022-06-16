<template>
  <div ref="userLayer" style="position:relative;witdh:100%;height:100%;cursor:none">
    <div
      :style="userStyle(user)"
      v-for="(user, ix) in onlineUsers" :key="ix">
        <CursorClickIcon
          :style="{
            width: '18px'
          }"
        />
        <div style="margin-left:4px">{{ cursorLabel(user) }}</div>
    </div>
  </div>
</template>
<script>
import { CursorClickIcon } from '@heroicons/vue/solid'
export default {
  components: {
    CursorClickIcon
  },
  props: ['storex', 'roomId'],
  computed: {
    clinic () {
      return this.storex.clinic.allClinics[this.roomId]
    },
    hasControl () {
      return this.clinic.hasControl
    },
    me () {
      return this.storex.user.user
    },
    users () {
      const users = Object.values(this.storex.network.friends)
      const me = {
        ...this.me,
        clinic: {
          cursorPosition: this.clinic.cursorPosition,
          currentClinicChatId: this.clinic.chat?.id
        }
      }
      return this.hasControl ? users : [...users, me]
    },
    onlineUsers () {
      const { userLayer } = this.$refs
      const chatId = this.storex.clinic.currentClinic?.chat.id
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
  },
  methods: {
    cursorLabel (user) {
      return this.me.id === user.id ? 
          this.clinic.requestingControl ? 'Waiting...' : 'Click to control'
        : user.username
    },
    userStyle (user) {
      const isMe = this.me.id === user.id 
      const isRequesting = isMe && this.clinic.requestingControl
      const style = {
        display: 'flex',
        position: 'absolute',
        top: `${user.cursor?.y}px`,
        left: `${user.cursor?.x}px`,
        padding: '6px',
        borderRadius: '10px',
        color: isRequesting ? 'black' : 'white',
        backgroundColor: isRequesting ? 'gainsboro' : 'black'
      }
      return style
    }
  }
}
</script>