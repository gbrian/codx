<template>
  <div class="h-full">
    <div class="mt-2 mb-6 w-full">
      <label class="input-group input-group-sm w-full">
        <input type="text"
          v-model="searchString"
          placeholder="Search..." class="input input-bordered input-sm w-full" @keypress.enter="doSearch"> 
        <span class="cursor-pointer text-base-content bg-base-200" @click="doSearch">
          <SearchIcon class="w-4" />
        </span>
      </label>
    </div>

    <div
      :class="['text-base pl-3 cursor-pointer mb-2 flex btn btn-outline btn-accent', searchType === 'academy' ? 'font-bold' : '']"
      @click="$emit('acamedy-courses')"
    >
      <AcademicCapIcon class="h-6 mr-2" />
      <div>codx academy</div>
      <div class="flex grow ml-2 mr-4">
        <progress class="progress progress-secondary mt-3 mx-2" value="20" max="100"></progress>
        <small>{{ me?.credits }}</small>
        <CreditCardIcon class="h-6 ml-1" />
      </div>
    </div>

    <div
      :class="['text-base pl-3 cursor-pointer mb-2 mt-6', searchType === 'clinic' ? 'font-bold' : '']"
      @click="$emit('coding-clinics')"
    >
      <TerminalIcon class="h-5 w-5 float-left mr-2" />
      Coding clinics
    </div>
    <div class="text-base pl-3 cursor-pointer mb-2 flex flex-row group" v-if="showTasks" @click="$emit('task-manager')">
      <MapIcon class="h-5 w-5 float-left mr-2" />Tasks assigned <strong>(10)</strong>
    </div>
    <div class="text-base pl-3 cursor-pointer mb-2"><ChatAltIcon class="h-5 w-5 float-left mr-2" />Recent</div>
    <div class="text-base pl-3 cursor-pointer mb-2"><StarIcon class="h-5 w-5 float-left mr-2" />Starred messages</div>
    <div class="text-base pl-3 cursor-pointer mb-2" @click="$emit('calendar')" v-if="false"><CalendarIcon class="h-5 w-5 float-left mr-2" />Next events</div>

    <div class="flex justify-between text-base pl-3 mt-3 cursor-pointer border-b border-slate-800"
      @click="channelsOpen = !channelsOpen"
    >
      <div>
        <ChevronDownIcon class="h-5 w-5 float-left mr-2" v-if="channelsOpen" />
        <ChevronUpIcon class="h-5 w-5 float-left mr-2" v-else />
        Channels
      </div>
      <PlusIcon class="h-5 w-5 float-left mr-2 cursor-pointer" @click.prevent.stop="onCreateNewChannel"/>
    </div>
    <div class="text-base pl-3"></div>

    <div
      class="space-y-1.5 overflow-y-auto pb-12 lg:pb-0"
      style="max-height: calc(100vh - 280px)"
      v-if="channelsOpen"
    >
      <div class="text-base pl-3 cursor-pointer mt-2 prose"
        v-for="(channel, ix) in $storex.channel.channels" :key="ix"
        @click="$emit('open-channel', channel)"
      >
        <h4>#{{ channel.name }}</h4>
      </div>
    </div>

    <div class="flex justify-between text-base pl-3 mt-3 cursor-pointer border-b border-slate-800"
      @click="directMessagesOpen = !directMessagesOpen"
    >
      <div>
        <ChevronDownIcon class="h-5 w-5 float-left mr-2" v-if="channelsOpen" />
        <ChevronUpIcon class="h-5 w-5 float-left mr-2" v-else />
        Chats
      </div>
      <PlusIcon class="h-5 w-5 float-left mr-2 cursor-pointer" @click.prevent.stop="$emit('new-chat')"/>
    </div>
    <div
      class="space-y-1.5 overflow-y-auto pb-12 lg:pb-0"
      style="max-height: calc(100vh - 280px)"
      v-if="directMessagesOpen"
    >
      <div
        v-for="(chat, ix) in $storex.chat.userChats" :key="ix"
        :class="['text-base cursor-pointer ml-3 mt-2 flex felx-row group justify-between', chat.id === openedChat?.id ? 'font-bold' : '']"
        @click="$emit('open-chat', chat)"
      >
          <div class="grow flex">
            <TerminalIcon class="w-4 mr-2" v-if="chat.clinic" />
            <h4 class="">
              @{{ chatName(chat)}}
            </h4>
            <div class="-space-x-1 ml-2">
              <UserAvatar v-for="(user, uix) in chat.users" :key="uix"
                :class="[user.openedChat === chat.id && user.online && !user.isMe ? '' : 'hidden']"
                :size="4"
                :user="user"
              />
            </div>
            <ChatAltIcon
              :class="['w-4 ml-2 text-warning', chat.missingMention ? 'animate-bounce' : '']"
              v-if="chat.unreadMessages"
            />
          </div>
          <div class="group-hover:visible invisible ml-4 pt-1">
            <TrashIcon class="w-5" @click.stop="confirmDeleteChat = chat" />
          </div>
      </div>
    </div>
    <Dialog
      v-if="confirmDeleteChat"
      @close="confirmDeleteChat = null"
      @ok="deleteConfirmChat"
    >
      <div class="prose">
        <h3>Delete chat {{ chatName(confirmDeleteChat) }}</h3>
      </div>
    </Dialog>
    <LoadingDialog v-if="loading" />
    <ChannelCreateDialog v-if="createNewChannel" @close="createNewChannel = false" />
    <Share v-if="share" />
  </div>
</template>

<script>
import {
  TerminalIcon,
  AtSymbolIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  HashtagIcon,
  ChatAltIcon,
  StarIcon,
  MapIcon,
  TrashIcon,
  CalendarIcon,
  AcademicCapIcon,
  CreditCardIcon,
  SearchIcon
} from '@heroicons/vue/outline'
import Dialog from '@/components/Dialog.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import ChannelCreateDialog from '@/components/channel/ChannelCreateDialog.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import Share from '@/components/Share.vue'
export default {
  components: {
    TerminalIcon,
    AtSymbolIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PlusIcon,
    HashtagIcon,
    ChatAltIcon,
    StarIcon,
    MapIcon,
    TrashIcon,
    CalendarIcon,
    AcademicCapIcon,
    CreditCardIcon,
    SearchIcon,
    Dialog,
    LoadingDialog,
    ChannelCreateDialog,
    UserAvatar,
    Share
  },
  data() {
    return {
      channelsOpen: true,
      directMessagesOpen: true,
      confirmDeleteChat: null,
      loading: false,
      createNewChannel: false,
      searchString: null,
      share: false
    }
  },
  computed: {
    searchType () {
      const { currentSearch } = this.$storex.search
      return currentSearch?.searchType
    },
    session () {
      return this.$storex.user.session
    },
    currentCompany () {
      return this.$storex.company.currentCompany || { settings: {} }
    },
    showTasks () {
      const { settings } = this.currentCompany
      return settings?.tasks
    },
    me () {
      return this.$storex.user.user
    },
    openedChat () {
      return this.$storex.chat.openedChat
    }
  },
  methods: {
    async deleteConfirmChat () {
      this.loading = true
      if (this.$storex.chat.openedChat === this.confirmDeleteChat) {
        this.$emit('academy-courses')
      }
      await this.$storex.chat.deleteChat(this.confirmDeleteChat)
      this.confirmDeleteChat = null
      this.loading = false
    },
    chatName (chat) {
      const { id: myId } = this.me
      const { users, name } = chat
      return name || (users.length > 1 ? chat.users.filter(({ id }) => id !== myId) : users)
        .map(u => u.username).join("-") 
    },
    onCreateNewChannel () {
      if (!this.$root.login()) return
      this.createNewChannel = true
    },
    doSearch () {
      const { searchString: q } = this
      q && this.$storex.search.doSearch({ q })
    }
  }
};
</script>
