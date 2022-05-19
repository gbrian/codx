<template>
  <div class="flex flex-col">
    <div class="navbar mb-2 shadow-lg w-full flex flex-row justify-between">
      <div class="px-2 mx-2n">
        <div><span class="text-lg font-bold">#open-clinics</span></div>
      </div>
      <div v-if="user.contentCreator">
        <button class="btn gap-2" @click="newTemplate = true">
          <PlusIcon class="w-6" />
          Create...
        </button>
      </div>
    </div>
    <div class="m-2 shadow-lg flex flex-col">
      <div class="p-2 flex" v-if="runningClinics">
        <TerminalIcon class="w-8 mr-2" />
        <div class="prose">
          <h3>Running clinics</h3>
        </div>
      </div>
      <OpenClinics class="p-2" v-if="runningClinics"
        @join-clinic="clinic => $emit('join-clinic', clinic)"
        @delete-clinic="clinic => $emit('delete-clinic', clinic)"
      />
    </div>
  </div>
</template>
<script>
import {
  TerminalIcon,
  PlusIcon
} from '@heroicons/vue/outline'
import OpenClinics from '@/components/OpenClinics.vue'
export default {
  components: {
    TerminalIcon,
    PlusIcon,
    OpenClinics
  },
  computed: {
    user () {
      return this.$storex.user.user
    },
    runningClinics () {
      return !!this.$storex.clinic.clinics?.length
    }
  }
}
</script>