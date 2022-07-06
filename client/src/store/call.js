import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { $storex } from '@/store'
import WebRTCRoom from '@/webrtc'

export const namespaced = true

export const state = () => ({
  calls: [],
  currentCall: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setCalls (state, calls) {
    state.calls = calls
  },
  setCurrentCall (state, id) {
    state.currentCall = state.calls[id]
  },
  updateCallFromRtc (state, rtc) {
    const call = state.calls[rtc.roomId]
    if (call) {
      call.streams = {
        ...rtc.streams
      }
      if (state.currentCall && state.currentCall.id === rtc.roomId) {
        state.currentCall = state.calls[rtc.roomId]
      }
    }
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    },
    async createNewCall ({ state }, { roomId, type = "audio" }) {
      const { user } = $storex.user
      const rtc = await WebRTCRoom.newRoom({
        video: type === "video",
        audio: true,
        userid: user.id,
        roomId,
        webrtc: $storex.company.webrtcSettings || user.webrtc,
        onStreamsChanged (ev) {
          $storex.call.updateCallFromRtc(ev)
        }
      })
      $storex.call.setCalls({
        ...state.calls,
        [rtc.roomId]: {
          id: rtc.roomId,
          type,
          callee: user,
          rtc,
          streams: rtc.streams
        }
      })
      $storex.call.setCurrentCall(rtc.roomId)
    },
    async joinCall (ctx, { type, roomId }) {
      await $storex.call.createNewCall({ type, roomId })
    },
    async endCurrentCall ({ state }) {
      await state.currentCall.rtc.disconnect()
      $storex.call.setCurrentCall()
    },
    toggleVideo (ctx, call) {
      call.rtc.toggleVideo()
    },
    toggleAudio (ctx, call) {
      call.rtc.toggleAudio()
    }
  },
)