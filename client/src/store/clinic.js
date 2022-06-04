import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { $storex } from '@/store'
import api from '@/api'

export const namespaced = true

export const state = () => ({
  clinics: null,
  currentClinic: null
})

export const getters = getterTree(state, {
  hostingClinic: ({ currentClinic }) => currentClinic?.neko?.remote.hosting ? currentClinic : null
})

export const mutations = mutationTree(state, {
  setClinics (state, clinics) {
    state.clinics = clinics
  },
  addClinic (state, clinic) {
    state.clinics = [...state.clinics.filter(c => c.id !== clinic.id), clinic]
  },
  setCurrentClinic (state, id) {
    state.currentClinic = state.clinics?.filter(c => c.id === id)[0]
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
      if ($storex.session.isOnline) {
        $storex.session.addListener({ event: 'clinic-request-control', cb: $storex.clinic.onReleaseControl.bind($storex.clinic) })
      } else {
        setTimeout(() =>  $storex.clinic.init(), 1000)
      }
    },
    async newCodingClinic({ state }, { chat, settings }) {
      const { data: clinic } = await api.createClinic({
        chat: { id: chat.id },
        settings
      })
      $storex.clinic.addClinic(clinic)
      const { id } = clinic
      $storex.clinic.setCurrentClinic(id)
      return clinic
    },
    async disconnect({ state: { rooms } }, id) {
      nekoClient.disconnect()
    },
    requestControl ({ state: { rooms } }, id = "main") {
      if (!neko.remote.hosting) {
        neko.remote.request()
      }
    },
    async deleteClinic ({ state: { clinics, currentClinic } }, clinic) {
      const { id } = clinic
      await api.deleteClinic(clinic)
      if (currentClinic && id === setCurrentClinic.id) {
        $stotex.clinic.setCurrentClinic()
      }
      $storex.clinic.setClinics(clinics.filter(c => c.id !== id))
    },
    notifyUserCursorPistion ({ state: { currentClinic }}, position) {
      const { id } = $storex.user.user
      console.log("clinic", { user: { id }, position })
    },
    requestControl({ state: { currentClinic }}) {
      if (currentClinic.neko.remote.hosting) {
        return
      }
      const { id } = $storex.user.user
      $storex.session.emit({
        event: 'clinic-request-control',
        data: { id, clinicId: currentClinic.id },
        cb: () => {
          currentClinic.neko.remote.request()
        }
      })
    },
    onReleaseControl ({ state: { currentClinic } }, { clinicId }) {
      if (currentClinic?.id === clinicId) {
        currentClinic?.neko.remote.release()
      }
    },
    releaseControl ({ state: { currentClinic } }) {
      currentClinic?.neko.remote.release()
    },
    sendEmote ({ state: { currentClinic }}, emote) {
      currentClinic.neko.chat.sendEmote(emote)
    }
  },
)