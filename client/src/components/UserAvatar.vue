<template>
  <div :class="['avatar indicator not-prose',
      online && !video ? 'online' : '',
      onlineChanged ? 'animate-pulse': ''
    ]"
    :title="'@' + user.username">
  <div class="absolute z-10">
    <slot name="badges" />
  </div>
  <div :class="['border border-neutral-focus', avatarClass]">
    <div :class="['indicator-item badge', muted ? 'badge-error text-black' : 'badge-secondary']" v-if="video">
      <MicrophoneIcon :class="['w-2', muted ? '' : 'animate-pulse']" />
    </div>
    <video
      autoplay
      :muted="video.type === 'local'"
      :src-object.prop.camel="paused ? null : video.stream"
      :poster="paused ? 'https://cdn.dribbble.com/users/2208826/screenshots/6286951/guanxian.gif' : ''"
      v-if="video"
      class="rounded-md object-fill z-0"
    ></video>
    <img :src="avatarImage(user.username, size || 10)" :width="size || 10" :height="size || 10" :class="online ? '' : 'grayscale'" v-else>
  </div>
</div> 
</template>
<script>
import {
  MicrophoneIcon
} from "@heroicons/vue/outline"
export default {
  components: {
    MicrophoneIcon
  },
  props: ['user', 'size', 'ring', 'showOnlineIf'],
  data () {
    return {
      onlineChanged: false
    }
  },
  computed: {
    video () {
      const { video } = this.user
      return video
    },
    paused () {
      const { video } = this.user
      return video && video.paused
    },
    muted () {
      const { video } = this.user
      return video && video.muted
    },
    avatarClass () {
      const { user, video, size, ring } = this
      return video ? 'rounded-btn w-24 h-12' :
        [`bg-neutral-focus rounded-full w-${size || 10} h-${size || 10}`, (ring ? `ring ring-primary ring-offset-base-${ring} ring-offset-2` : '')]
    },
    online () {
      return this.showOnlineIf === undefined ? this.user.online :
        this.user.online && this.showOnlineIf
    }
  },
  watch: {
    online (newVal) {
      this.$emit('user-online', { user: this.user, isOnline: newVal })
      this.onlineChanged = true
      setTimeout(() => { this.onlineChanged = false }, 3000)
    }
  },
  methods: {
    avatarImage () {
      const { online, username, color } = this.user
      const letters = `${username[0]}${username[1]}`.toUpperCase()
      const w = window
      const d = w.document
      var canvas = d.createElement('canvas');
      var context = canvas.getContext("2d");
      var size = 60;
      // Set canvas with & height
      canvas.width = size;
      canvas.height = size;
      // Select a font family to support different language characters
      // like Arial
      context.font = Math.round(canvas.width / 2) + "px Arial";
      context.textAlign = "center";
      // Setup background and front color
      context.fillStyle = online ? color : 'transparent';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = online ? "#FFF": "gray";
      context.fillText(letters, size / 2, size / 1.5);
      // Set image representation in default format (png)
      const dataURI = canvas.toDataURL();
      // Dispose canvas element
      canvas = null;
      return dataURI;
    }
  }
}
</script>
<style lang="scss">
  .avatar {
    video {
      height: 100%;
    }
  }
</style>