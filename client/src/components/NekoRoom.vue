<template>
  <div class="neko-room w-full h-full relative">
    <iframe :class="['w-full h-full', loading ? 'opacity-0' : '']"
      :src="pageReady ? `${url}&ts=${ts}` : ''" frameborder="0" ref="nekoFrame" @load="onLoad()" v-if="pageReady"
    >
    </iframe>
    <div class="absolute top-0 left-0 right-0 bottom-0 place-content-center prose" v-if="loading">
      <h2>Setting up room</h2>
      <div class="loading">
        <div class="p-6 space-y-2 artboard phone animate-pulse">
          <progress class="progress progress-accent" :value="checkCount" max="100"></progress> 
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { mount } from 'mount-vue-component'
import NekoRoomUserLayer from './NekoRoomUserLayer.vue'
export default {
  props: ['room'],
  data () {
    return {
      pageReady: false,
      loading: true,
      checkCount: 1,
      ts: new Date().getTime(),
      checkTout: null,
      userLayer: null
    }
  },
  created () {
    this.checkPage()
  },
  destroyed () {
    console.log("NekoRoom", "destroyed")
    clearInterval(this.checkTout)
    if (this.userLayer) {
      this.userLayer.destroy()
    }
  },
  computed: {
    url () {
      const { url, nekoPassword } = this.room
      const { user: { username } } = this.$storex.user
      return `${url}/?pwd=${nekoPassword}&displayName=${username}`
    },
    testUrl () {
      const { url, nekoPassword } = this.room
      const { user: { username } } = this.$storex.user
      return `${url}/emoji.json?pwd=${nekoPassword}&displayName=${username}`
    },
    document () {
      const { nekoFrame: { contentWindow: { document } } } = this.$refs
      return document
    },
    $client () {
      const { nekoFrame: { contentWindow: { $client } } } = this.$refs
      return $client
    },
    neko () {
      const { $vue: { $accessor: neko } } = this.$client
      return neko
    },
    overlay () {
      return this.document.getElementsByClassName('overlay')[0]
    },
    users () {
      return this.$storex.network.friends
    }
  },
  methods: {
    async checkPage () {
      this.checkCount = this.checkCount + 1
      try {
        await axios.get(this.testUrl)
        this.checkCount = 100
        setTimeout(() => this.pageReady = true, 300)
      } catch {
        this.checkTout = setTimeout(() => this.checkPage(), 5000)
      }
    },
    onLoad () {
      if (!this.overlay) {
        this.ts = new Date().getTime()
        setTimeout(() => this.onLoad(), 1000)
        return
      }
      const style = `
        <style>
          body p,
          .room-container,
          .header-container,
          .video-menu.bottom,
          .video-menu.top .fa-expand,
          .neko-menu,
          .request-control
          {
            display: none !important;
          }
          html,
          body,
          .video-container,
          .video .player {
            background-color: transparent !important;
          }
          .user-layer {
            position: absolute;
            z-index: 1;
            width: 100%;
            height: 100%;
          }
          .overlay {
            z-index: 2;
          }
          .player-overlay {
            z-index: 3;
          }
        </style>`
      this.document.head.insertAdjacentHTML("beforeend", style)
      this.overlay.addEventListener('click', ev => {
        this.$storex.clinic.requestControl()
      })
      this.overlay.addEventListener('mousemove', this.setUserCursor.bind(this))
      this.overlay.addEventListener('mouseleave', this.removeUserCursor.bind(this))
      this.room.neko = this.neko
      this.room.nekoClient = this.$client
      this.loading = false
      // Create user layer
      this.userLayer = mount(NekoRoomUserLayer, { props: { storex: this.$storex } })
      const { el } = this.userLayer
      el.className = "user-layer"
      this.overlay.parentNode.prepend(el)
    },
    setUserCursor ({ layerX, layerY }) {
      const { clientWidth, clientHeight } = this.overlay
      const px = 100 / clientWidth * layerX
      const py = 100 / clientHeight * layerY
      this.room.cursorPosition = { px, py, ts: new Date().getTime() }
    },
    removeUserCursor () {
      this.room.cursorPosition = null
    }
  }
}
</script>