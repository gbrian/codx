<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2">
      <Logo :class="['w-10 cursor-pointer avatar cursor-pointer']" />
      <div class="grow text-center prose"><h6>{{ `#${room.name}` }}</h6></div>
      <div class="flex gap-2">
        <button class="btn btn-sm btn-circle" @click="$emit('call', { mic: true })">
          <i class="fa-solid fa-microphone"></i>
        </button>
        <button class="btn btn-sm btn-circle" @click="$emit('call', { video: true })">
          <i class="fa-solid fa-camera"></i>
        </button>
        <button class="btn btn-sm btn-circle btn-error" @click="$emit('call', { exit: true })" v-if="call">
          <i class="fa-solid fa-phone-slash"></i>
        </button>
        <div class="dropdown dropdown-end">
          <button class="btn btn-sm btn-circle" tabindex="1">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
          <ul tabindex="0" class="dropdown-content menu p-2 border bg-base-100 rounded-box w-52">
            <li>
              <a @click="$emit('full-screen')" v-if="fullScreen">
                <i class="fa-solid fa-compress"></i>
                <span class="ml-4">Exit Full screen</span>
              </a>
              <a @click="$emit('full-screen')" v-else>
                <i class="fa-solid fa-expand"></i>
                <span class="ml-4">Full screen</span>
              </a>
            </li>
            <li>
              <a @click="onSettings">
                <i class="fa-solid fa-gear"></i>
                <span class="ml-4">Settings</span>
              </a>
            </li>
            <li>
              <a @click="$emit('leave')">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span class="ml-4">Leave</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex-1 flex overflow-hidden">
      <div class="w-full pb-4 mt-2 overflow-y-scroll overflow-x-hidden scrollbar-thin">
        <div v-for="(message, mix) in chat.messages" :key="mix"
          :class="['gap-2 mb-6 p-2 rounded-md', message.extra ? 'bg-base-200 cursor-pointer' : '']">
          <div class="flex justify-between">
            <div class="flex gap-2">
              <div class="avatar">
                <div class="w-8 rounded-full">
                  <img :src="message.from.avatar" />
                </div>
              </div>
              <div class="prose"><h6>{{ `@${message.from.username}` }}</h6></div>
            </div>
            <div class="prose"><strong>11:00 AM</strong></div>
          </div>
          <div class="prose text-primary-content"><strong>{{ message.content }}</strong></div>
        </div>
      </div>
    </div>
    <div class="flex gap-1">
      <button class="btn btn-cirlce">
        <i class="fa-solid fa-face-grin"></i>
      </button>
      <div class="relative grow">
        <input type="text" placeholder="Send a message..." class="w-full input input-bordered" />
        <div class="absolute right-4 top-3">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Logo from '@/components/Logo.vue'
export default {
  components: {
    Logo
  },
  props: ['room', 'fullScreen', 'call'],
  computed: {
    chat () {
      return this.room.chat
    }
  }
}
</script>