import { createStore } from 'vuex'
import {
  useAccessor,
} from 'typed-vuex'

import * as user from './user'
import * as chat from './chat'
import * as clinic from './clinic'
import * as call from './call'
import * as session from './session'
import * as network from './network'
import * as search from './search'
import * as channel from './channel'
import * as company from './company'
import * as log from './log'
import * as global from './global'

const storePattern = {
  modules: { user, chat, clinic, call, session, network, search, channel, company, log, global },
}

const store = createStore(storePattern)

export const $storex = useAccessor(store, storePattern)
$storex.init = async () => {
  await $storex.log.init()
  await $storex.session.init()
  await $storex.clinic.init()
}
window.$storex = $storex
export default store