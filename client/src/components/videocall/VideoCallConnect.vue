<template>
  <Modal class="">
    <h2>Video Connect</h2>
    <div class="flex justify-center">
      <video
        autoplay
        :muted="true"
        :src-object.prop.camel="video && settings.video ? video.stream : null"
        :poster="settings.video ? '' : 'https://cdn.dribbble.com/users/2208826/screenshots/6286951/guanxian.gif'"
        class="border bg-base-300 rounded-md object-fill z-0 h-48"
      ></video>
    </div>
    <div class="flex justify-center gap-4">
      <button class="btn btn-circle shadow-md" @click="settings.mic = !settings.mic" v-if="settings.mic">
        <i class="fa-solid fa-microphone"></i>
      </button>
      <button class="btn btn-circle shadow-md" @click="settings.mic = !settings.mic" v-else>
        <i class="fa-solid fa-microphone-slash"></i>
      </button>
      <button class="btn btn-circle shadow-md" @click="settings.video = !settings.video" v-if="settings.video">
        <i class="fa-solid fa-video"></i>
      </button>
      <button class="btn btn-circle shadow-md" @click="settings.video = !settings.video" v-else>
        <i class="fa-solid fa-video-slash"></i>
      </button>
    </div>
    <div class="flex justify-center gap-4">
      <div>
        <select class="w-full select max-w-xs" v-model="settings.audioId" @change="onAudioChange">
          <option disabled selected>Microhone</option>
          <option v-for="(device, dix) in audioInputDevices" :key="dix" :value="device.id">{{ device.label }}</option>
        </select>
      </div>
      <div>
       <select class="w-full select max-w-xs" v-model="settings.videoId" @change="onVideoChange">
        <option disabled selected>Video</option>
        <option v-for="(device, vix) in videoInputDevices" :key="vix" :value="device.id">{{ device.label }}</option>
      </select>
</div>
    </div>
    <button class="btn" @click="$emit('connect')">
      Start
    </button>
  </Modal>
</template>
<script>
import Modal from '@/components/Modal.vue'
export default {
  components: {
    Modal
  },
  props: ['settings'],
  data () {
    return {
      call: null,
      video: null,
      callSettings: { ...this.$props.settings }
    }
  },
  created () {
    this.initCall()
  },
  unmounted () {
    this.endCall()
  },
  computed: {
    audioInputDevices () {
      return this.call?.DetectRTC.audioInputDevices
    },
    videoInputDevices () {
      return this.call?.DetectRTC.videoInputDevices
    }
  },
  methods: {
    async initCall () {
      const { videoId, audioId } = this.callSettings
      this.call = await this.$storex.call.createNewCall({
          roomId: new Date().getTime(),
          type: "video",
          videoId,
          audioId
        })
      this.video = Object.values(this.call.streams)[0]
      this.callSettings = {
        ...this.callSettings,
        audioId: audioId || this.audioInputDevices[0].id,
        videoId: videoId || this.videoInputDevices[0].id
      }
    },
    endCall () {
      if (this.call) {
        this.$storex.call.endCall(this.call)
      }
      this.call = null
      this.video = null
    },
    onVideoChange () {
      this.endCall()
      this.initCall()
    },
    onAudioChange () {
      console.log("audio id", this.settings)
    }
  }
}
</script>