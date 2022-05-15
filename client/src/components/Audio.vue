<template>
  <audio :src="audioSrc" autoplay />
</template>
<script>
export default {
  props: ['audio'],
  computed: {
    audioSrc () {
      return {
        "pop-up": "/sound/dry-pop-up-notification-alert-2356.wav",
        "pop-up": "/sound/interface-hint-notification-911.wav",
        "pop-up": "/sound/message-pop-alert-2354.mp3",
        "pop-up": "/sound/mixkit-waiting-ringtone-1354.wav",
        "pop-up": "/sound/software-interface-back-2575.wav",
      }[this.audio]
    }
  }
}
</script>