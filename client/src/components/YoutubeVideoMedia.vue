<template>
  <iframe
    :src="url"
    :title="title"
    class="h-full w-full"
    frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
</template>
<script>
export default {
  props: ['url', 'title']
}
</script>