<template>
  <div class="online-friends h-full carousel carousel-vertical rounded-box py-2">
    <div class="carousel-item pl-2 pr-1"
      v-for="(user, ix) in onlineFriends" :key="ix">
      <div class="dropdown"
        :title="`@${user.username}`">
        <UserAvatar
          :tabindex="ix"
          :user="user"
          :size="8"
          class="mr-1 cursor-pointer"
          @user-online="onUserOnlineChange"
        >
          <template v-slot:badges>
          </template>
        </UserAvatar>
      </div>
    </div>
  </div>
</template>
<script>
import UserAvatar from '@/components/UserAvatar.vue'
export default {
  components: {
    UserAvatar
  },
  props: ['onlineFriends'],
  methods: {
    onUserOnlineChange (user) {
    }
  }
}
</script>