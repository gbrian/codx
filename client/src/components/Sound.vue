<template>
  <audio :src="audioUrl" />
</template>
<script>
export default {
  props: ['audio'],
  computed: {
    audioUrl () {
      return '/sound/dry-pop-up-notification-alert-2356.wav'
    }
  }
}
</script>