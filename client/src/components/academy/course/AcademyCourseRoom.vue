<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between" v-if="!fullScreen">
      <div class="flex gap-2">
        <div class="flex mt-2 gap-2">
          <UserAvatar
            v-for="(user, uix) in users" :key="uix"
            :user="user" />
        </div>
      </div>
      <button class="btn" @click="$emit('leave')">
        Leave
      </button>
    </div>
    <div class="flex grow gap-2">
      <NekoRoom
        :class="['grow', fullScreen ? '': 'py-2 bg-base-300 rounded-md']"
        :roomId="room.id"
      />
      <div class="w-1/6 bg-base-300 rounded-md" v-if="call"></div>
    </div>
  </div>
</template>
<script>
import UserAvatar from '@/components/UserAvatar.vue'
import NekoRoom from '@/components/NekoRoom.vue'
export default {
  components: {
    UserAvatar,
    NekoRoom
  },
  props: ['room', 'fullScreen', 'call'],
  computed: {
    me () {
      return this.$storex.user.user
    },
    users () {
      return this.room.chat.users
    }
  },
  methods: {
    onSettings () {
    }
  }
}
</script>