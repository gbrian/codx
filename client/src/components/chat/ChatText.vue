<template>
  <div class="w-full">
    <div v-html="parsedContent" v-if="isHtml"></div>
    <pre v-else>{{ content }} </pre>
  </div>
</template>
<script>
export default {
  props: ['content', 'isHtml'],
  computed: {
    parsedContent () {
      return this.content.replace(/\n/mg, '<br/>')
    }
  }
}
</script>