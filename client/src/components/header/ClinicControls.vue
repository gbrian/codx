<template>
  <div class="flex space-x-2 p-2 border rounded-md">
    <div
      :class="['online btn btn-sm btn-accent rounded-md']"
      @click="$storex.clinic.releaseControl({ clinic })"
      v-if="clinic?.hasControl"
    >
      <CursorClickIcon class="cursor-pointer w-5 "/>
    </div>
    <div
      :class="['avatar', clinic?.active ? 'online btn btn-sm btn-accent rounded-md' : 'btn btn-sm btn-ghost']"
      @click="$emit('toggle-clinic')"
    >
      <TerminalIcon class="w-6" />
      <div class="ml-2" v-if="clinic">{{ clinic?.name }}</div>
    </div>
    <Emotes
      :clinicId="clinicId"
      class="btn-sm btn-ghost rounded-md" />
    <div
        :class="['avatar', camOn ? 'online btn btn-sm btn-accent rounded-md' : 'btn btn-sm btn-ghost']"
        @click="$emit('toggle-media', clinicId)"
      >
        <i class="fa-solid fa-photo-film w-6"></i>
      </div>
    <div
      class="dropdown dropdown-end btn-sm btn-ghost rounded-md"
      v-if="true"
    >
      <label tabindex="1">
        <CogIcon class="w-5 cursor-pointer m-1"/>
      </label>
      <ul tabindex="1" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <a @click="$emit('clinic-fullScreen')">
            <ArrowsExpandIcon  class="w-5 mr-2"/>{{ 'Full screen' }}
          </a>
        </li>
        <li>
          <a target="_blank" :href="`${clinic?.url}-coder/`">
            <ExternalLinkIcon class="w-5 mr-2"/>Coder
          </a>
        </li>
        <li> 
          <a target="_blank" :href="`${clinic?.url}-mysite/`">
            <ExternalLinkIcon class="w-5 mr-2"/>Website
          </a>
        </li>
        <hr/>
        <li> 
          <a @click="refreshRoom" :class="[ restarting ? 'animate-ping' : '']">
            <RefreshIcon class="w-5 mr-2" />{{ restarting ? 'Restarting...' : 'Restart' }} 
          </a>
        </li>
        <li @click="publishRoom"> 
          <a>
            <CloudUploadIcon class="w-5 mr-2" />Publish
          </a>
        </li>
      </ul>
    </div>
    <PublishDialog
      v-if="publish"
      :clinicId="clinicId"
      @close="publish = false"
    />
  </div>
</template>
<script>
import {
  CursorClickIcon,
  StopIcon,
  TerminalIcon,
  ArrowsExpandIcon,
  ExternalLinkIcon,
  CogIcon,
  SaveAsIcon,
  CloudUploadIcon,
  RefreshIcon,
} from "@heroicons/vue/outline"
import Emotes from '@/components/emotes/Emotes.vue'
import PublishDialog from '@/components/clinic/PublishDialog.vue'
export default {
  components: {
    CursorClickIcon,
    StopIcon,
    TerminalIcon,
    ArrowsExpandIcon,
    ExternalLinkIcon,
    CogIcon,
    SaveAsIcon,
    CloudUploadIcon,
    RefreshIcon,
    Emotes,
    PublishDialog
  },
  props: ['clinicId', 'isFullscreen'],
  data () {
    return {
      publish: false,
      restarting: false
    }
  },
  computed: {
    clinic () {
      return this.$storex.clinic.allClinics[this.clinicId]
    }
  },
  methods: {
    publishRoom () {
      this.publish = true
    },
    async refreshRoom () {
      this.restarting = true
      await this.$storex.clinic.reloadClinic(this.clinicId)
      this.restarting = false
    }
  }
}
</script>