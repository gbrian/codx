<template>
  <div class="hero min-h-screen relative">
    <iframe class="w-full h-full" :src="url" frameborder="0" @unload="onClose" ref="landing" >
    </iframe>
  </div>
</template>
<script>
export default {
  computed: {
    url () {
      const { CODX_LANDING } = process.env
      return CODX_LANDING || 'https://wodx.meetnav.com/howitworks'
    }
  }
}
</script>