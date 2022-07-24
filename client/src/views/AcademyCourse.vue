<template>
  <div class="flex w-full h-full relative bg-base-100">
    <div class="p-2 flex flex-col justify-between" v-if="fullScreen">
      <Logo :class="['w-10 avatar cursor-pointer p-1 mb-4']" />
      <div class="flex flex-col gap-2">
        <button class="btn btn-circle shadow-md" @click="onCall({ video: true })">
          <i class="fa-solid fa-camera"></i>
        </button>
        <button class="btn btn-circle shadow-md" @click="onCall({ mic: true })">
          <i class="fa-solid fa-microphone"></i>
        </button>
        <button class="btn btn-circle shadow-md btn-error" @click="onCall({ exit: true })" v-if="call">
          <i class="fa-solid fa-phone-slash"></i>
        </button>
        <button class="btn btn-circle shadow-md" @click="onFullScreen">
          <i class="fa-solid fa-compress"></i>
        </button>
      </div>
    </div>
    <CollapsibleChat
      :class="['p-2 w-1/5 bg-base-300']"
      :room="room"
      :fullScreen="fullScreen"
      :call="call"
      @full-screen="onFullScreen"
      @call="onCall"
      v-else
    />
    <AcademyCourseRoom
      class="p-2 grow"
      :room="room"
      :fullScreen="fullScreen"
      :call="call"
      @full-screen="onFullScreen"
      @leave="$router.push('/academy')"
    />
    <VideoCallConnect
      @close="onCancelConnect"
      @connect="onCallConnect"
      :settings="videoSettings"
      v-if="callCannect"
    />
  </div>
</template>
<script>
import Logo from '@/components/Logo.vue'
import CollapsibleChat from '@/components/academy/course/CollapsibleChat.vue'
import AcademyCourseRoom from '@/components/academy/course/AcademyCourseRoom.vue'
import VideoCallConnect from '@/components/videocall/VideoCallConnect.vue'
export default {
  components: {
    Logo,
    CollapsibleChat,
    AcademyCourseRoom,
    VideoCallConnect
  },
  data () {
    return {
      fullScreen: false,
      callCannect: false,
      call: false,
      videoSettings: {}
    }
  },
  async created () {
    await this.$storex.chat.refreshChat(this.room.chat)
    this.$el.addEventListener('fullscreenchange', () => {
      this.fullScreen = !!document.fullscreenElement
    })
  },
  computed: {
    room () {
      const { roomName } = this.$route.params
      const clinics = Object.values(this.$storex.clinic.allClinics)
      const [clinic] = clinics.filter(c => c.roomName === roomName)
      return {
        ...clinic,
        chat: this.$storex.chat.chats[clinic.chat.id]
      }
    }
  },
  methods: {
    onFullScreen () {
      const main = this.$el
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        main.requestFullscreen()
      }
    },
    onCall ({ exit, video }) {
      if (!exit && !this.call) {
        this.videoSettings = {
          mic: true,
          video
        }
        this.callCannect = true
      } else if (exit) {
        this.callCannect = false
        this.$storex.call.endCall(this.call)
        this.call = null
      }
    },
    async onCallConnect () {
      this.callCannect = false
      this.call = true
    },
    onCancelConnect () {
      this.callCannect = false
    }
  }
}
</script>