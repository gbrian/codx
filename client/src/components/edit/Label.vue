<template>
  <div class="cursor-pointer" @click="canEdit ? (editing = true && (newLabel = label)) : null">
    <input type="text"
      v-model="newLabel"
      class="input w-full max-w-xs"
      v-if="editing"
      @keypress.enter="emitChange"
      @keypress.esc="editing = false"
      @blur="editing = false"
    >
    <div v-else>{{ label }}</div>
  </div>
</template>
<script>
export default {
  props: ['label', 'canEdit'],
  data () {
    return {
      editing: false,
      newLabel: null
    }
  },
  methods: {
    emitChange () {
      const { newLabel, label } = this
      if (newLabel !== label) {
        this.$emit('labelChange', newLabel)
      }
      this.editing = false
    }
  }
}
</script>