<template>
  <div class="academy flex w-full h-full bg-focus text-focus-content">
    <Explorer class="py-8 px-6 w-1/6" />
    <Search class="grow py-8 p-4 h-full" />
  </div>
</template>
<script>
import Explorer from '@/components/academy/Explorer.vue'
import Search from '@/components/academy/search/Search.vue'
export default {
  components: {
    Explorer,
    Search
  }
}
</script>