<template>
  <div class="navigator prose">
    <blockquote>CODX ACADEMY</blockquote>
    <div class="flex flex-col gap-6">
      <div class="cursor-pointer" @click="$emit('mode-change', 'search')">
        <div :class="['btn mr-4', mode === 'search' ? 'btn-primary' : '']">
          <i class="fa-solid fa-house"></i>
        </div>
        Discover
      </div>
      <div class="cursor-pointer" @click="$emit('mode-change', 'running')">
        <div :class="['btn mr-4', mode === 'running' ? 'btn-primary' : '']">
          <i class="fa-solid fa-laptop-code"></i>
        </div>
        My Running Courses
      </div>
      <div class="cursor-pointer" @click="$emit('mode-change', 'favourites')">
        <div :class="['btn mr-4', mode === 'favourites' ? 'btn-primary' : '']">
          <i class="fa-solid fa-star"></i>
        </div>
        Favourites
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['mode']
}
</script>