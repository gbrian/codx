import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { $storex } from '@/store'
import api from '@/api'

export const namespaced = true

export const state = () => ({
  allClinics: {},
  currentClinic: null
})

export const getters = getterTree(state, {
  clinics: ({ allClinics }) => Object.values(allClinics),
  hostingClinic: ({ currentClinic }) => currentClinic?.neko?.remote.hosting ? currentClinic : null
})

function prepareClinic (clinic) {
  return {
    ...clinic,
    hasControl: false,
    requestingControl: false
  }
}

export const mutations = mutationTree(state, {
  setClinics (state, clinics) {
    clinics.map(prepareClinic)
      .forEach(c => {
        state.allClinics = {
          ...state.allClinics,
          [c.id]: c
        }
      })
  },
  addClinic (state, clinic) {
    state.allClinics ={
      ...state.allClinics,
      [clinic.id]: prepareClinic(clinic)
    }
  },
  setCurrentClinic (state, id) {
    state.currentClinic = state.allClinics[id]
  },
  setUserHasControl ({ allClinics }, { clinic, hasControl }) {
    allClinics[clinic.id].hasControl = hasControl
  },
  setRequestControl ({ allClinics }, { clinic, requestingControl }) {
    allClinics[clinic.id].requestingControl = requestingControl
  },
  removeClinic (state, id) {
    delete state.allClinics[id]
    state.allClinics = {
      ...state.allClinics
    }
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
      if ($storex.session.isOnline) {
        $storex.session.addListener({ event: 'clinic-request-control', cb: $storex.clinic.releaseControl.bind($storex.clinic) })
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
      $storex.clinic.removeClinic(id)
    },
    notifyUserCursorPistion ({ state: { currentClinic }}, position) {
      const { id } = $storex.user.user
      console.log("clinic", { user: { id }, position })
    },
    requestControl({ state: { currentClinic }}) {
      const { id } = $storex.user.user
      $storex.clinic.setRequestControl({ clinic: currentClinic, requestingControl: true })
      $storex.session.emit({
        event: 'clinic-request-control',
        data: { user: { id }, clinic: { id: currentClinic.id } },
        cb: () => {
          $storex.clinic.setUserHasControl({ clinic: currentClinic, hasControl: true })
          $storex.clinic.setRequestControl({ clinic: currentClinic, requestingControl: false })
        }
      })
    },
    releaseControl (_, { clinic }) {
      $storex.clinic.setUserHasControl({ clinic, hasControl: false })
    },
    sendEmote ({ state: { currentClinic }}, emote) {
      currentClinic.neko.chat.sendEmote(emote)
    }
  },
)