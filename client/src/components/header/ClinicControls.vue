<template>
  <div class="flex space-x-2 p-2 border rounded-md">
    <div
      :class="['online btn btn-sm btn-accent rounded-md']"
      @click="clinic.releaseControl()"
      v-if="liveClinic"
    >
      <CursorClickIcon class="cursor-pointer w-5 "/>
    </div>
    <div
      :class="['avatar', liveClinic ? 'online btn btn-sm btn-accent rounded-md' : 'btn btn-sm btn-ghost']"
      tabindex="0"
      @click="$emit('toggle-clinic')"
    >
      <TerminalIcon class="w-6" />
      <div class="ml-2" v-if="clinic">{{ clinic?.name }}</div>
    </div>
    <div
      :class="['btn btn-sm rounded-md', isFullscreen ? 'online btn-accent' : '']"
      @click="$emit('clinic-fullScreen')"
      v-if="clinic"
    >
      <ArrowsExpandIcon  class="w-6"/>
    </div>
    <Emotes />
    <div
      class="dropdown dropdown-end"
      v-if="clinic"
    >
      <label tabindex="0">
        <ExternalLinkIcon class="w-5 cursor-pointer mt-1"/>
      </label>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <a target="_blank" :href="`${clinic.url}-coder/`">
            <ExternalLinkIcon class="w-5 mr-2"/>Coder
          </a>
        </li>
        <li> 
          <a target="_blank" :href="`${clinic.url}-mysite/`">
            <ExternalLinkIcon class="w-5 mr-2"/>Website
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {
  CursorClickIcon,
  StopIcon,
  TerminalIcon,
  ArrowsExpandIcon,
  ExternalLinkIcon
} from "@heroicons/vue/outline"
import Emotes from '@/components/emotes/Emotes.vue'
export default {
  components: {
    CursorClickIcon,
    StopIcon,
    TerminalIcon,
    ArrowsExpandIcon,
    ExternalLinkIcon,
    Emotes
  },
  props: ['clinic', 'liveClinic']
}
</script>