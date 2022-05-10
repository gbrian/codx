<template>
  <div
      class="text-primary flex flex-row justify-between space-x-5 border-b border-slate-600/50 w-full"
    >
    <div class="flex flex-row">
      <Logo 
        :class="['cursor-pointer w-10 h-10 my-4 mx-2', liveClinic ? 'lg:hidde' : '']"
        v-if="!explorerVisible && liveClinic"
        @click="$emit('open-explorer')"
      />
      <ChevronLeftIcon
        :class="['cursor-pointer w-7 ml-2 mr-5', liveClinic ? '' : 'lg:hidde']"
        v-if="explorerVisible && liveClinic"
        @click="$emit('close-explorer')"
      />
      <div class="flex flex-col pt-2 px-2">
        <div class="flex flex-row">
          <div class="dropdown"
            :title="`@${user.username}`"
            v-for="(user, ix) in chatUsers" :key="ix">
            <UserAvatar
              :tabindex="ix"
              :user="user"
              :size="8"
              class="mr-1 cursor-pointer"
            >
              <template v-slot:badges>
                <TerminalIcon class="w-4 bg-neutral-focus text-neutral-content" v-if="userOnClinic(user) && !userHostingClinic(user)" />
                <CursorClickIcon class="w-4 bg-neutral-focus text-neutral-content" v-if="userHostingClinic(user)" />
              </template>
            </UserAvatar>
            <ul :tabindex="ix" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
              <li><a @click="$emit('user-profile', user)" >{{ `@${user.username}` }} </a></li>
              <li v-if="user.id !== me.id" @click="$emit('remove-user', user)" ><a><BanIcon class="w-5 mr-2"/>Remove</a></li>
            </ul>
          </div>
          <UserAdd class="" :ignoreUsers="chatUsers" @user="user => addUser(user)" />
        </div>
        <div class="flex items-center space-x-6 prose">
          <div class="badge badge-outline">
            <small><strong><i><Label :label="headerTitle" @labelChange="label => onHeaderTitleChange(label)" :canEdit="canEditHeader" /></i></strong></small>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center space-x-6">
      <div class="flex space-x-2 p-2 border rounded-md" v-if="liveClinic">
        <div
          :class="['avatar', chatVisible ? 'btn btn-sm btn-accent rounded-md' : 'btn btn-sm btn-ghost']"
          @click="$emit('toggle-chat')"
        >
          <ChatAltIcon class="hidden md:block cursor-pointer w-5 "/>
        </div>
      </div>
      <div class="flex space-x-2 p-2 border rounded-md">
        <div
          :class="['avatar', videoVisible ? 'btn btn-sm btn-accent rounded-md' : 'btn btn-sm btn-ghost']"
          @click="$emit('toggle-video')"
          v-if="call"
        >
          <EyeIcon class="hidden md:block cursor-pointer w-5 "/>
        </div>
        <div
          :class="['avatar', micOn ? 'online btn btn-sm btn-accent rounded-md' : 'btn btn-sm btn-ghost']"
          @click="onMic"
        >
          <MicrophoneIcon class="hidden md:block cursor-pointer w-5 "/>
        </div>
        <div
          :class="['avatar', camOn ? 'online btn btn-sm btn-accent rounded-md' : 'btn btn-sm btn-ghost']"
          @click="onCam"
        >
          <VideoCameraIcon class="cursor-pointer w-5 "/>
        </div>
        <div
          :class="['online btn btn-sm btn-error text-white rounded-md']"
          @click="onEndCall"
          v-if="call"
        >
          <PhoneMissedCallIcon class="cursor-pointer w-5 "/>
        </div>
      </div>

      <div class="flex space-x-2 p-2 border rounded-md">
        <div
          :class="['online btn btn-sm btn-accent rounded-md']"
          @click="clinic.releaseControl()"
          v-if="clinic"
        >
          <CursorClickIcon class="cursor-pointer w-5 "/>
        </div>
        <div
          :class="['avatar', liveClinic ? 'online btn btn-sm btn-accent rounded-md' : 'btn btn-sm btn-ghost']"
          tabindex="0"
          @click="toggleClinic"
        >
          <StopIcon class="w-6" v-if="clinic"/>
          <TerminalIcon class="w-6" v-else />
          <div class="ml-2" v-if="chat?.clinic">{{ chat?.clinic?.name }}</div>
        </div>
        <div
          :class="['btn btn-sm rounded-md', isFullscreen ? 'online btn-accent' : '']"
          @click="$emit('clinic-fullScreen')"
         v-if="clinic"
        >
          <ArrowsExpandIcon  class="w-6"/>
        </div>
        
        <div
          class="dropdown dropdown-end"
          v-if="clinic"
        >
          <label tabindex="0">
            <ExternalLinkIcon class="w-5 cursor-pointer mt-1"/>
          </label>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <a target="_blank" :href="`${clinic.url}-coder/`">
                <ExternalLinkIcon class="w-5 mr-2"/>Coder
              </a>
            </li>
            <li> 
              <a target="_blank" :href="`${clinic.url}-mysite/`">
                <ExternalLinkIcon class="w-5 mr-2"/>Website
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  SearchIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  ChevronLeftIcon,
  TerminalIcon,
  MenuIcon,
  ChatAltIcon,
  PhoneMissedCallIcon,
  TrashIcon,
  StopIcon,
  BanIcon,
  CursorClickIcon,
  EyeIcon,
  CogIcon,
  ExternalLinkIcon,
  ArrowsExpandIcon,
} from "@heroicons/vue/outline"
import UserAdd from '@/components/UserAdd.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import Label from '@/components/edit/Label.vue'
import Logo from '@/components/Logo.vue'
export default {
  components: {
    SearchIcon,
    VideoCameraIcon,
    MicrophoneIcon,
    ChevronLeftIcon,
    TerminalIcon,
    MenuIcon,
    ChatAltIcon,
    PhoneMissedCallIcon,
    TrashIcon,
    StopIcon,
    BanIcon,
    EyeIcon,
    CursorClickIcon,
    CogIcon,
    ExternalLinkIcon,
    ArrowsExpandIcon,
    UserAdd,
    UserAvatar,
    Label,
    Logo
  },
  props: ['chat', 'explorerVisible', 'chatVisible', 'videoVisible', 'clinic', 'isFullscreen'],
  data () {
    return {
      newCodingClinic: false
    }
  },
  computed: {
    liveClinic () {
      return this.clinic
    },
    call () {
      return this.$storex.call.currentCall
    },
    calleeVideo () {
      return this.call ? this.call.streams[this.call.callee.id] : null
    },
    micOn () {
      return this.call && !this.calleeVideo.muted
    },
    camOn () {
      return this.call && !this.calleeVideo.paused
    },
    chatUsers () {
      return (this.chat||{ users: []}).users.map(u => ({
        ...u,
        video: this.call ? this.call.streams[u.id] : null
      }))
    },
    showChatToggle () {
      return this.liveClinic
    },
    me () {
      return this.$storex.user.user
    },
    headerTitle () {
      if (this.chat) {
        return this.chat.chatName
      }
      return null
    },
    canEditHeader () {
      return this.chat?.isAdmin
    }
  },
  watch: {
  },
  methods: {
    addUser (user) {
      const { chat } = this
      this.$storex.chat.addUser({ chat, user })
    },
    onMic () {
      if (!this.call) {
        this.newCall('voice')
      } else {
        this.$storex.call.toggleAudio(this.call)
      }
    },
    onCam () {
      if (!this.call) {
        this.newCall('video')
      } else {
        this.$storex.call.toggleVideo(this.call)
      }
    },
    onEndCall () {
      this.$storex.call.endCurrentCall()
    },
    async newCall (type) {
      const { chat: { id, roomId, users } = { roomId: new Date(), users: [] }} = this
      const { user: { username } } = this.$storex.user

      await this.$storex.call.createNewCall({ roomId, type, users })
      id && this.$storex.chat.sendMessage({
        chat: this.chat,
        content: `@${username} started new call.`,
        extra: {
          event: 'call',
          type,
          roomId
        }
      })
    },
    userOnClinic ({ clinic }) {
      return !!clinic
    },
    userHostingClinic ({ clinic }) {
      return clinic && clinic.hosting
    },
    toggleClinic () {
      if (this.liveClinic)  {
        return this.$emit('leave-clinic')
      }
      if (this.chat?.clinic) {
        return this.$emit('join-clinic', this.chat?.clinic)
      }
      return this.$emit('new-clinic')
    },
    onHeaderTitleChange (newName) {
      if (this.chat) {
        this.$storex.chat.updateChat({ id: this.chat.id, changes: { name: newName } })
      }
    }
  },
  beforeUnmount () {
    if (this.call) {
      this.$storex.call.endCurrentCall()
    }
  }
}
</script>