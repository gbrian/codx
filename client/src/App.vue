<template>
  <div class="h-screen overflow-y-auto">
    <Notifications class="z-1000"/>
    <router-view />
    <Audio :audio="audio" v-if="false"/>
  </div>
</template>
<script>
import { themeChange } from 'theme-change'
import Notifications from '@/components/Notifications.vue'
import Audio from '@/components/Audio.vue'
export default {
  components: {
    Notifications,
    Audio
  },
  data () {
    return {
      doLogin: false,
      currentTheme: localStorage.getItem("theme") || 'dark',
      audio: null
    }
  },
  mounted () {
    themeChange(false)
  },
  computed: {
    isMobile () {
      return this.$isMobile()
    }
  },
  methods: {
    login () {
      const { authenticated } = this.$storex.user
      !authenticated && this.$router.push("/login")
      return authenticated
    },
    isDarkMode () {
      const darkThemes = ['dark', 'halloween', 'black', 'luxury', 'dracula', 'forest', 'synthwave', 'aqua']
      return darkThemes.indexOf(this.currentTheme) !== -1
    },
    setTheme (theme) {
      this.currentTheme = theme
    },
    setAudio (audio) {
      this.audio = audio
      setTimeout(() => { this.audio = null }, 2000)
    }
  }
}
</script>