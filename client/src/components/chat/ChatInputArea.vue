<template>
  <div class="flex items-center md:space-x-5 space-x-3 p-4 w-full">
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text" v-if="editing">Editing, press Esc. to cancel</span>
      </label>
      <textarea type="text" :placeholder="placeholder || 'Type messages'"
        ref="textarea"
        :class="['input block w-full md:px-4 px-3 md:py-3 py-2 focus:outline-none text-primary text-sm border-gray-300 rounded',
          editing ? 'border-error' : '']"
        v-model="editMessage"
        @keydown.enter.exact.prevent="$emit('send-message', editMessage)"
        @keydown.enter.shift.exact.prevent="newLine"
        @keydown.esc="$emit('abort-editing')"
        @keypress="resize"
      />
    </div>
    <EmojiHappyIcon class="cursor-pointer md:w-5 w-7 text-primary" v-if="false" />
    <PaperClipIcon class="cursor-pointer md:w-5 w-7 text-primary" v-if="false" />
    <div>
      <button
        class="bg-accent text-accent-content md:w-14 w-10 md:h-12 h-10 flex items-center justify-center rounded-lg"
      >
        <ChatAltIcon class="cursor-pointer md:w-6 w-5 t" @click="$emit('send-message', editMessage)" />
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
      editMessage: this.$props.message,
      lineHeight: null
    }
  },
  watch: {
    message (newVal) {
      this.editMessage = newVal
    }
  },
  methods: {
    newLine () {
      this.editMessage += '\n'
      this.resize()
    },
    resize() {
      const { textarea } = this.$refs;
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }
}
</script>