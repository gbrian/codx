<template>
  <div class="flex flex-row group gap-2">
    <slot></slot>
    <ClipboardCopyIcon class="group-hover:visible invisible w-6 cursor-pointer" @click="$emit('copy-message')" />
    <PencilIcon class="group-hover:visible invisible w-6 cursor-pointer" @click="$emit('edit-message')" />
    <TrashIcon class="group-hover:visible invisible w-6 cursor-pointer text-error" @click="$emit('delete-message')" />
  </div>
</template>

<script>
import {
  ClipboardCopyIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/vue/solid";
export default {
  components: {
    ClipboardCopyIcon,
    PencilIcon,
    TrashIcon
  },
};
</script>
