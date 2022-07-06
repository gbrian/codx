<template>
  <div class="clinic-list">
    <div class="flex my-2">
      <FilterIcon class="w-6 mr-4" />
      <select class="select max-w-xs"
        v-for="(filter, fix) in filters" :key="fix"
        @change="option => applyFilter(filter, option)"
      >
        <option selected>{{ filter.title }}</option>
        <option v-for="(option, oix) in filter.options" :key="oix">{{ option }}</option>
      </select>
    </div>
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
  SaveIcon,
  FilterIcon
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
    FilterIcon,
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
      return this.clinics
        .filter(c => c.visible === undefined || c.visible)
        .sort((a, b) => a.createdAt > b.createdAt ? -1 : 0)
    },
    filters () {
      return [
        { title: "Provider", options: [...new Set(this.clinics.map(c => c.provider ))], isVisible (c) { return !this.filter || c.provider === this.filter } }
      ]
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
    },
    applyFilter(filter, { target: { value: option } }) {
      const valid = filter.options.some(o => o === option)
      filter.filter = valid ? option : undefined
      const { filters, clinics } = this
      clinics.map(c => {
        c.visible = filters.some(f => f.isVisible(c))
      })
    }
  }
}
</script>