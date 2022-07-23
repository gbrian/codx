<template>
  <div class="profile shadow-md rounded-md p-4 w-full bg-base-200 text-base-content flex gap-4 cursor-pointer">
    <UserAvatar :user="me" />
    <div class="">
      <h3><strong>{{ me.username }}</strong></h3>
      <div>300 <strong class="text-primary">credits</strong></div>
    </div>
  </div>
</template>
<script>
import UserAvatar from '@/components/UserAvatar.vue'
export default {
  components: {
    UserAvatar
  },
  computed: {
    me () {
      return this.$storex.user.user
    }
  }
}
</script>