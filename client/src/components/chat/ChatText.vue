<template>
  <div v-html="parsedContent">
  </div>
</template>
<script>
export default {
  props: ['content'],
  computed: {
    parsedContent () {
      return this.content.replace(/\n/mg, '<br/>')
    }
  }
}
</script>