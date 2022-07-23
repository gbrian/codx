<template>
  <Dialog :title="'About codx'">
      <template v-slot:icon>
        <img src="/logo.png" class="w-20" />
      </template>
      <template v-slot:actions>
        <div class="absolute left-4 bottom-0">
          <small>Powered by neko</small>
          <img class="w-12 m-pb-2" src="/neko-70x70.png" style="opacity:0.4" />
        </div>
        <button class="btn shadow-sm px-4 py-2 mr-3" @click="$emit('cancel')">Close</button>
      </template>
      <div>
        <h2>Codx the coding clinic platform</h2>
        <small>v 0.1</small>
        <div>
          <u>Special thanks:</u>
          <div class="">Neko https://github.com/m1k1o/neko</div>
          <div class="">Neko-rooms https://github.com/m1k1o/neko-rooms</div>
          <div class="">code-server https://github.com/coder/code-server</div>
        </div>
      </div>
    </Dialog>
</template>
<script>
import Dialog from '@/components/Dialog.vue'
export default {
  components: {
    Dialog
  },
}
</script>