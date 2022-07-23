<template>
  <div class="explorer flex flex-col gap-6">
    <Logo :class="['w-12 cursor-pointer avatar cursor-pointer p-1 mb-4']" />
    <Profile />
    <Navigator />
    <Chats class="grow" />
    <ThemeSelector />
  </div>
</template>
<script>
import Profile from './Profile.vue'
import Navigator from './Navigator.vue'
import Chats from './Chats.vue'
import Logo from '@/components/Logo.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
export default {
  components: {
    Logo,
    Profile,
    Navigator,
    Chats,
    ThemeSelector
  }
}
</script>