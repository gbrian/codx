<template>
 <div class="text-primary">
   <label class="label">
      <span class="label-text">Theme</span>
    </label>
   <select
    v-model="key"
    class="select select-bordered w-full max-w-xs"
    data-choose-theme
    @change="$root.setTheme(key)"
  >
   <option v-for="(theme, index) in themes" :key="index" class="mr-5">
    {{ theme }}
   </option>
  </select>
 </div>
</template>

<script>
import { themeChange } from 'theme-change'

export default {
 data() {
  return {
   themes: [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk'
   ],
   key: '',
  }
 },

 async mounted() {
  themeChange(false)
  await this.getTheme()
 },

 methods: {
  getTheme() {
   this.key = localStorage.getItem('theme') || 'dark'
   return this.key
  },
 },
}
</script>