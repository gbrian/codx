<template>
  <div class="flex items-center md:space-x-5 space-x-3 p-4 w-full">
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text" v-if="editing">Editing, press Esc. to cancel</span>
      </label>
      <input type="text" :placeholder="placeholder || 'Type messages'"
        :class="['input block w-full md:px-4 px-3 md:py-3 py-2 focus:outline-none text-primary text-sm border-gray-300 rounded',
          editing ? 'border-error' : '']"
        v-model="message"
        @keydown.enter="$emit('send-message', message)"
        @keydown.esc="$emit('abort-editing')"
      >
    </div>
    <EmojiHappyIcon class="cursor-pointer md:w-5 w-7 text-primary" />
    <PaperClipIcon class="cursor-pointer md:w-5 w-7 text-primary" />
    <div>
      <button
        class="bg-accent text-accent-content md:w-14 w-10 md:h-12 h-10 flex items-center justify-center rounded-lg"
      >
        <ChatAltIcon class="cursor-pointer md:w-6 w-5 t" @click="$emit('send-message', message)" />
      </button>
    </div>
    <EyeOffIcon class="cursor-pointer md:w-14 text-error btn btn-outline"
      v-if="closeMe"
      @click="$emit('hide-chat')" />
    
  </div>
</template>
<script>
import {
  ChatAltIcon,
  EmojiHappyIcon,
  PaperClipIcon,
  EyeOffIcon
} from "@heroicons/vue/outline";
export default {
  components: {
    ChatAltIcon,
    EmojiHappyIcon,
    PaperClipIcon,
    EyeOffIcon
  },
  props: ['show', 'chat', 'closeMe', 'editing', 'message', 'placeholder'],
  data() {
    return {
      editMessage: this.$props.message
    }
  },
}
</script>