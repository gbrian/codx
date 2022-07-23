<template>
  <div class="flex justify-between">
    <div class="flex gap-2">
      <div v-for="(filter, fix) in filters" :key="fix">
        <button class="btn btn-sm btn-outline">{{ filter }}</button>
      </div>
    </div>
    <button class="btn btn-sm btn-primary gap-2">
      <i class="fa-solid fa-filter"></i>
      filters
    </button>
  </div>
</template>
<script>
export default {
  computed: {
    filters () {
      return ["python", "docker", "data", "web", "mobile", "html", "vuejs", ".NET"]
    }
  }
}
</script>