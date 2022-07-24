<template>
    <div class="modal modal-open">
      <div class="flex flex-col modal-box relative gap-3 scrollbar-hide">
        <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-3 top-2" @click="$emit('close')">✕</label>
        <slot>
        </slot>
      </div>
    </div>
</template>
<script>
export default {
}
</script>