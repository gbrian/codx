import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { $storex } from '@/store'
import api from '@/api'

export const namespaced = true

function getKeyboardSettings (neko) {
  try {
    if (neko.settings.keyboard_layouts_list[navigator.language]) {
      return navigator.language
    }
  } catch {}
  return 'es'
}
export const state = () => ({
  allClinics: {},
  currentClinic: null,
  settings: {
    scroll: 1,
    keyboardLayout: 'es'
  }
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
    clinics && clinics.map(prepareClinic)
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
  },
  initClinicNeko (state, { clinic, neko }) {
    clinic.neko = neko
    state.settings = {
      ...state.settings,
      keyboardLayout: getKeyboardSettings(neko)
    }
    setTimeout(() => $storex.clinic.sendEmote({ clinicId: clinic.id, emote: 'wave' }), 2000)
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
    async newCodingClinic(_, { chat, settings }) {
      if (!chat?.id) {
        chat = await $storex.chat.newChat({ name: settings.name })
      }
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
    requestControl(_, clinic) {
      const { id } = $storex.user.user
      $storex.clinic.setRequestControl({ clinic, requestingControl: true })
      $storex.session.emit({
        event: 'clinic-request-control',
        data: { user: { id }, clinic: { id: clinic.id } },
        cb: () => {
          $storex.clinic.setUserHasControl({ clinic, hasControl: true })
          $storex.clinic.setRequestControl({ clinic, requestingControl: false })
          // Scroll smooth
          currentClinic.neko.settings.setScroll(settings.scroll)
          currentClinic.neko.settings.setKeyboardLayout(settings.keyboardLayout)
        }
      })
    },
    releaseControl (_, { clinic }) {
      $storex.clinic.setUserHasControl({ clinic, hasControl: false })
    },
    sendEmote ({ state: { allClinics }}, { clinicId, emote }) {
      allClinics[clinicId].neko?.chat.sendEmote(emote)
    },
    saveAsClinic (_, { id }) {
      return api.createSnapshot({ clinic: { id } })
    },
    createClinicTemplate (_, clinicTemplate) {
      return api.createClinicTemplate(clinicTemplate)
    },
    reloadClinic (_, clinicId) {
      return api.reloadClinic(clinicId)
    }
  },
)