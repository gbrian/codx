import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { $storex } from '@/store'

export const namespaced = true

export const state = () => ({
  fullScreen: false
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  togglefullScreen (state) {
    state.fullScreen = !state.fullScreen
  }
})
