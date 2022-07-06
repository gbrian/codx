<template>
  <div class="flex flex-row h-screen overflow-hidden w-full bg-base-200" ref="main">
    <SideBar
      class=""
      :explorerVisible="explorerVisible"
      @sideBar="toggleSideBar"
      @codx-icon-click="onCodxIconClick"
      @switch-company="onSwitchCompany"
      v-if="sideBarVisible"
    />
    <div :class="[
      'detail-bar drop-shadow-md',
      'grow h-full py-2 relative',
      'flex flex-col justify-between',
      explorerVisible ? 'w-1/3' : null]"
      >
      <div class="flex h-full">
        <Explorer :class="['explorer grow text-sm pl-2 pr-4 bg-neutral-focus text-neutral-content']"
          v-if="explorerVisible"
          @academy-courses="onAcademyCourses"
          @coding-clinics="onCodingClinics"
          @open-chat="chat => onOpenChat(chat)"
          @open-channel="onOpenChannel"
          @new-chat="onNewChat"
          @task-manager="onTaskManager"
          @calendar="() => toggleSideBar('calendar')"
          @show-help="onShowHelp"
        />
      </div>
      <UserCalendar class="w-full" v-if="calendarVisible"/>
      <InviteBtn v-if="false" />
    </div>
    <TaskManager class="w-1/3"
      v-if="taskManager"
      @task-chat="onOpenChat"
    />
    <SearchResults
      v-if="showCodingClinics"
      class="h-full w-full"
      @new-clinic="onResultsNewCodingClinic"
    />
    <SearchOpenClinics
      v-if="showOpenClinics"
      class="h-full w-full"
      @join-clinic="joinClinic"
      @delete-clinic="deleteClinic"
    />
    <Channel
      v-if="showChannel"
      class="h-full w-full"
      :channel="$storex.channel.currentChannel"
    />
    <CodxAcademyHero class="academy-showHelp" v-if="isHelpShown" />
    <Profile class="profile w-full h-full p-4" v-if="isProfile" />
    <div class="splittedView lg:flex flex-col w-full bg-base-200" v-if="splittedView">
      <Header
          class="bg-neutral"
          :chat="$storex.chat.openedChat"
          :explorerVisible="explorerVisible"
          :chatVisible="chatVisible"
          :videoVisible="videoCall && !videoHidden"
          :clinicId="currentClinic?.id"
          :isFullscreen="isFullscreen"
          @leave-clinic="leaveClinic"
          @delete-clinic="deleteClinic"
          @join-clinic="joinClinic"
          @new-clinic="showCodingClinicDialog = true"
          @open-explorer="sideBar = 'explorer'"
          @toggle-chat="toggleChatHidden"
          @remove-user="removeUser"
          @user-profile="showUserProfile"
          @toggle-video="toggleVideoHidden"
          @clinic-fullScreen="clinicFullScreen"
          @toggle-media="toggleMediaPlayer"
          @toggle-explorer="onCodxIconClick"
          v-if="showHeader"
        />
      <div class="lg:flex flex-row hidden h-full w-full">
        <div class="grow mt-1" v-if="currentClinic">
          <NekoRoom :roomId="currentClinic.id" ref="nekoRoom" />
        </div>
        <div :class="['flex m-2',
            stackPanels ? 'flex-col-reverse' : 'flex-row',
            currentClinic ? (chatVisible ? 'w-1/3' : 'w-1/6') : 'grow'
          ]"
          v-if="stackPanelVisible"
        >
          <ChatBox class="w-full chat-box grow border-l border-slate-500 bg-neutral-focus text-neutral-content"
            :chat="$storex.chat.openedChat" v-if="chatVisible"
            @on-event-click="onEventClick"
            @hide-chat="toggleChatHidden"
          />
          <VideoCall
            :class="['flex-none rounded-md p-2', chatVisible ? 'w-1/3' : 'w-full']"
            :call="$storex.call.currentCall"
            v-if="videoCallVisible"
            @close="toggleVideoHidden"
          />
        </div>
        <MediaPlayer
            :class="['flex-none rounded-md p-2 bg-neutral-focus rounded-md w-1/5']"
            :clinicId="currentClinic.id"
            v-if="mediaPlayerVisible"
          />
      </div>
    </div>
    <LoadingDialog v-if="loading" />
    <NewCodingClinicDialog
      v-if="showCodingClinicDialog"
      @cancel="showCodingClinicDialog = false"
      @ok="onNewCodingClinic"
      />
  </div>
</template>
<script>
import SideBar from "@/components/SideBar.vue"
import ChatBox from "@/components/chat/ChatBox.vue"
import Profile from "@/components/profile/Profile.vue"
import ChatList from "@/views/ChatList.vue"
import Explorer from "@/views/Explorer.vue"
import VideoCall from "@/views/VideoCall.vue"
import Header from "@/components/header/Header.vue"
import SearchResults from "@/components/SearchResults.vue"
import SearchOpenClinics from "@/components/SearchOpenClinics.vue"
import NewCodingClinicDialog from '@/components/NewCodingClinicDialog.vue'
import NekoRoom from '@/components/NekoRoom.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import Channel from '@/components/channel/Channel.vue'
import Sprint from '@/components/Sprint.vue'
import TaskManager from '@/components/TaskManager.vue'
import InviteBtn from '@/components/InviteBtn.vue'
import CodxAcademyHero from '@/components/hero/CodxAcademyHero.vue'
import UserCalendar from '@/components/UserCalendar.vue'
import MediaPlayer from '@/components/clinic/MediaPlayer.vue'
export default {
  components: {
    SideBar,
    ChatBox,
    ChatList,
    Profile,
    Explorer,
    VideoCall,
    Header,
    SearchResults,
    SearchOpenClinics,
    NewCodingClinicDialog,
    NekoRoom,
    LoadingDialog,
    Channel,
    Sprint,
    TaskManager,
    InviteBtn,
    CodxAcademyHero,
    UserCalendar,
    MediaPlayer
  },
  data() {
    return {
      clinicList: false,
      show: 1,
      list: [{}, {}],
      sideBar: 'explorer',
      showCodingClinics: true,
      showOpenClinics: false,
      showCodingClinicDialog: false,
      chatHidden: false,
      videoHidden: false,
      loading: false,
      taskManager: null,
      showHelp: false,
      profileUser: null,
      isFullscreen: false,
      mediaPlayerVisible: false
    };
  },
  mounted () {
    const { chat: chatName, channel, runClinicName } = this.$route.params
    if (chatName) {
      const  { chats } = this.$storex.chat
      const chat = Object.keys(chats).map(id => chats[id])
        .filter(c => c.chatName === chatName)[0]
      chat && this.onOpenChat(chat)
    }
    if (channel) {
      this.onOpenChannel({ id: parseInt(channel) })
    }
    this.onAcademyCourses()
  },
  computed: {
    openChat () {
      const { openedChat } = this.$storex.chat
      return openedChat
    },
    currentClinic () {
      return this.$storex.clinic.currentClinic
    },
    chatVisible () {
      return this.openChat && !this.chatHidden
    },
    explorerVisible () {
      return this.sideBar === 'explorer'
    },
    calendarVisible () {
      return this.sideBar === 'calendar'
    },
    showLeftBar () {
      return this.sideBar !== ''
    },
    sideBarVisible () {
      return true
    },
    showChannel () {
      return this.$storex.channel.currentChannel
    },
    showHeader () {
      return this.openChat
    },
    currentCompnay () {
      return this.$storex.company.currentCompnay
    },
    splittedView () {
      return !this.showHelp && !this.showCodingClinics && !this.showOpenClinics && !this.showChannel && (!this.taskManager || this.chatVisible)
    },
    videoCall () {
      return this.$storex.call.currentCall
    },
    videoCallVisible () {
      return (this.videoCall && this.$storex.call.currentCall.streams) && !this.videoHidden
    },
    stackPanels () {
      return this.chatVisible && this.videoCallVisible && this.currentClinic
    },
    isProfile () {
      return this.$route.path.indexOf("/profile/") !== -1
    },
    isHelpShown () {
      return this.showHelp
    },
    stackPanelVisible () {
      return this.chatVisible || this.videoCallVisible
    },
    resizibleExplorer () {
      return !!this.currentClinic
    }
  },
  methods: {
    showChat() {
      this.show = !this.show;
    },
    toggleSideBar (view) {
      this.sideBar = view
    },
    async resetView (options) {
      const { keepChat } = options||{}
      this.showHelp = false
      this.leaveClinic ()
      if (!keepChat) {
        await this.$storex.chat.setOpenedChat()
      }
      await this.$storex.channel.setCurrentChannel()
      this.showCodingClinics = false
      this.showOpenClinics = false
      this.$router.push('/')
    },
    onCodxIconClick () {
      if (this.explorerVisible) {
        this.sideBar = ''
      } else {
        this.sideBar = 'explorer'
      }
    },
    async onOpenChat (chat) {
      if (this.$storex.chat.openedChat?.id === chat?.id) {
        return
      }
      await this.resetView()
      await this.$storex.chat.setOpenedChat({ id: chat.id, visible: true })
      if (chat.openClinic && chat.clinic) {
        this.joinClinic(chat.clinic)
      }
      this.$router.push(`/chat/${chat.chatName}`)
    },
    async onOpenChannel (channel) {
      this.resetView()
      this.$router.push(`/channel/${channel.id}`)
      this.$storex.channel.openChannel(channel)
    },
    async onAcademyCourses () {
      await this.resetView()
      this.showCodingClinics = await this.$storex.search.academyCourses()
    },
    async onCodingClinics () {
      await this.resetView()
      this.showOpenClinics = true
    },
    async onNewChat (chatSettings) {
      if (!this.$root.login()) return
      const chat = await this.$storex.chat.newChat(chatSettings)
      this.onOpenChat(chat)
    },
    async onResultsNewCodingClinic (settings) {
      this.resetView()
      await this.onNewCodingClinic(settings)
    },
    async onNewCodingClinic (settings) {
      try {
        const chat = this.$storex.chat.openedChat
        const clinic = await this.$storex.clinic.newCodingClinic({ chat, settings })
        const { user: { username } } = this.$storex.user
        if (chat) {
          this.$storex.chat.sendMessage({
            chat,
            content: `@${username} started new clinic.`,
            extra: {
              event: 'clinic',
              clinic: { id: clinic.id }
            }
          })
        }
        this.joinClinic(clinic)
        this.showCodingClinicDialog = false
        this.showHelp = false
      } catch{}
    },
    deleteClinic (clinic) {
      $storex.clinic.deleteClinic(clinic)
    },
    async joinClinic ({ id, chat = {} }, alreadyNotified) {
      await this.resetView({ keepChat: true })
      const { openedChat = {} } = this.$storex.chat
      if (chat.id) {
        await this.onOpenChat(chat)
        if (!this.chatHidden) {
          this.toggleChatHidden()
        }
      }
      this.$storex.clinic.setCurrentClinic(id)
      if (!alreadyNotified) {
        const chat = this.$storex.chat.openedChat
        const { user: { username } } = this.$storex.user
        if (chat) {
          this.$storex.chat.sendMessage({
            chat,
            content: `@${username} joined clinic.`,
            extra: {
              event: 'clinic',
              clinic: { id: this.$storex.clinic.currentClinic.id }
            }
          })
        }
      }
    },
    leaveClinic () {
      this.clinicList = false
      this.$storex.clinic.setCurrentClinic()
      if (!this.chatVisible) {
        this.chatHidden = false
      }
    },
    async toggleChatHidden () {
      if (!this.$storex.chat.openedChat) {
        const { currentClinic } = this.$storex.clinic
        if (currentClinic) {
          const chat = await this.$storex.chat.newChat({ clinicId: currentClinic.id })
          this.$storex.chat.setOpenedChat({ ...chat, visible: true })
        }
      }
      this.chatHidden = !this.chatHidden
      if (this.$storex.chat.openedChat) {
        this.$storex.chat.openedChat.visible = !this.chatHidden
      }
    },
    toggleVideoHidden () {
      this.videoHidden = !this.videoHidden
    },
    toggleMediaPlayer () {
      if (this.currentClinic?.media) {
        this.mediaPlayerVisible = !this.mediaPlayerVisible
      } else {
        this.mediaPlayerVisible = false
      }
    },
    onEventClick ({ event: eventSettings }) {
      const { event, clinic, type, roomId } = eventSettings
      if (event === 'call') {
        this.$storex.call.joinCall({ type, roomId })
      }
      if (event === 'clinic') {
        this.joinClinic(clinic, true)
      }
    },
    onSwitchCompany (company) {
      this.$storex.company.setCurrentCompany(company)
      if (this.taskManager && this.taskManager !== company) {
        this.taskManager = null
        this.$storex.chat.setOpenedChat()
        this.clinicList = true
      }
    },
    onTaskManager () {
      this.clinicList = false
      this.showHeader = false
      this.showCodingClinics = false
      this.$storex.clinic.setCurrentClinic()
      this.$storex.chat.setOpenedChat()
      this.taskManager = this.currentCompnay
    },
    removeUser (user) {
      const chat = this.$storex.chat.openedChat
      this.$storex.chat.removeUser({ user, chat })
    },
    showUserProfile (user){
    },
    clinicFullScreen () {
      const { main } = this.$refs
      if (document.fullscreenElement) {
        document.exitFullscreen()
        this.isFullscreen = false
      } else {
        main.requestFullscreen()
        this.isFullscreen = true
      }
    },
    async onShowHelp () {
      await this.resetView()
      this.showHelp = true
    }
  }
};
</script>