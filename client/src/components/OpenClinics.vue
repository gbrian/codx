<template>
  <div class="clinic-list">
    <div class="grid grid-rows-2 grid-flow-col gap-4 p-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
      <div class="relative px-2 py-1 border rounded-md flex flex-col justify-between bg-base-100 border-accent-focus drop-shadow-lg"
        v-for="(clinic, cix) in orderedClinics" :key="cix"
      >
        <div class="grow">
          <div class="flex gap-2">
            <h3 :class="[clinic.canEdit ? 'cursor-pointer': '']"
              @click="clinic.canEdit && (clinic.nameEdit = clinic.name)"
              v-if="!clinic.nameEdit">
                {{ clinic.name }}
            </h3>
            <input v-model="clinic.nameEdit" type="text"
              class="input input-bordered input-sm w-full max-w-xs"
              @keypress.enter="() => [(clinic.nameEdit = null), $emit('update-clinic', { ...clinic, name: clinic.nameEdit })]"
              v-else
            >
            <XCircleIcon class="w-4 cursor-pointer text-error" @click="clinic.nameEdit = null" v-if="clinic.nameEdit" />
          </div>
          <div class="w-full prose"><small>{{ clinicCreationData(clinic) }}</small></div>
        </div>
        <div class="">
          <UserAvatar v-for="(user, uix) in clinicUsers(clinic)" :key="uix"
            :user="user" size="6"
          />
        </div>
        <div class="flex gap-2 justify-end">
          <button class="btn btn-xs btn-outline btn-warning gap-2"
            @click.prevent.stop="$emit('join-clinic', clinic)">
            <TerminalIcon class="w-4" /> Join
          </button>
          <button class="btn btn-xs btn-outline btn-error gap-2"
            @click="deleteClinic = clinic"
            v-if="true || clinic.canDelete"
          >
            <TrashIcon class="w-4" />
          </button>
        </div>
        <small>{{ clinic.provider }}</small>
      </div>
    </div>
    <DeleteClinicDialog
      :clinic="deleteClinic"
      @ok="onDeleteClinic"
      @cancel="deleteClinic = null"
      v-if="deleteClinic"
    />
  </div>
</template>
<script>
import {
  TerminalIcon,
  TrashIcon,
  PencilIcon,
  XCircleIcon,
  SaveIcon
} from "@heroicons/vue/outline"
import moment from 'moment'
import UserAvatar from '@/components/UserAvatar.vue'
import DeleteClinicDialog from '@/components/DeleteClinicDialog.vue'
export default {
  components: {
    TerminalIcon,
    TrashIcon,
    PencilIcon,
    XCircleIcon,
    SaveIcon,
    UserAvatar,
    DeleteClinicDialog
  },
  props: ['head'],
  data () {
    return {
      editClinic: false,
      deleteClinic: null
    }
  },
  computed: {
    clinics () {
      const { head } = this
      return this.$storex.clinic.clinics.slice(0, parseInt(head || 10000))
    },
    me () {
      return this.$storex.user.user
    },
    orderedClinics () {
      return this.clinics.sort((a, b) => a.createdAt > b.createdAt ? -1 : 0)
    }
  },
  methods: {
    clinicChat ({ chat: { id } = {}}) {
      const { chats } = this.$storex.chat
      return chats[id]
    },
    clinicUsers (clinic) {
      const chat = this.clinicChat(clinic)
      return chat?.users
    },
    clinicCreationData (clinic) {
      return moment(clinic.createdAt).fromNow()
    },
    onDeleteClinic () {
      this.$emit('delete-clinic', this.deleteClinic)
      this.deleteClinic = null
    }
  }
}
</script>