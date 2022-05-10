<template>
  <div class="h-full relative">
    <div class="flex flex-col justify-between absolute top-0 left-0 right-0 bottom-0">
      <div ref="messageWindow"
        class="h-full overflow-y-auto md:p-6 p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100"
        @scroll="onMessageWindowScroll"
      >
        <div class="chat-date"
          v-for="(dayMessages, dix) in dayMessages" :key="dix"
        >
          <div class="mb-6 text-center"><span class="bg-neutral text-neutral-content rounded-md px-3 py-1">{{ dayMessages.displayDate }}</span></div>
          <div
            class="mb-4"
            v-for="(message, ix) in groupedMessages(dayMessages.messages)" :key="ix"
          >
            <ChatEvent
              :message="message"
              @cancel="onCancelEvent(message)"
              @ok="onConfirmEvent(message)"
              :isMe="me.id === message?.from?.id"
              v-if="message.event" />
            <ChatEntry
              :isMe="me.id === message?.from?.id"
              :message="message"
              @edit-message="onEditMessage"
              v-else/>
          </div>
        </div>
      </div>

      <ChatInputArea
        class="border-t border-slate-600/50"
        :editing="editing" :chat="chat" :closeMe="closeMe" :message="message"
        @send-message="sendMessage"
        @abort-editing="abortEditing"
        @hide-chat="$emit('hide-chat')"
      />

    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ChatEntry from './ChatEntry.vue'
import ChatEvent from './ChatEvent.vue'
import ChatInputArea from './ChatInputArea.vue'
export default {
  components: {
    ChatEntry,
    ChatEvent,
    ChatInputArea
  },
  props: ['show', 'chat', 'closeMe'],
  data() {
    return {
      message: '',
      hasScrolled: false,
      editing: null
    }
  },
  computed: {
    me () {
      return this.$storex.user.user
    },
    chatMessages () {
      const now = moment()
      return this.chat.messages.filter(({ createdAt, extra }) => !extra || now.diff(createdAt, 'hours') < 1 )
    },
    dayMessages () {
      !this.hasScrolled && requestAnimationFrame(this.scrollToBottom.bind(this))
      const now = moment()
      const byDay = this.chatMessages
        .filter(m => m.content)
        .reduce((acc, m) => {
          const { createdAt: ts } = m
          const createdAt = moment(ts)
          const messageDateFromNow = now.diff(createdAt, 'days')
          const displayDate = messageDateFromNow > 2 ? createdAt.format("MMMM D, YYYY") : createdAt.fromNow()
          if (acc.length) {
            const { createdAt: ldd, messages } = acc[acc.length-1]
            const sameDay = createdAt.format("DD-MM-YYYY") === ldd.format("DD-MM-YYYY")
            const closeInTime = createdAt.diff(ldd, 'minutes') < 20
            if (sameDay && closeInTime) {
              messages.push(m)
              return acc
            }
          }
          acc.push({
            createdAt,
            displayDate,
            messages: [m]
          })
          return acc
        }, [])
      return byDay
    },
    users () {
      const { admins, guests } = this.chat
      return [
        ...admins.map(u => ({ ...u, isAdmin: true })),
        ...guests
      ]
    }
  },
  mounted () {
    this.scrollToBottom()
  },
  methods: {
    async sendMessage (message) {
      await this.$storex.chat.sendMessage({
        chat: this.chat,
        ...this.editing,
        content: message
      })
      this.abortEditing()
    },
    groupedMessages (messages) {
      const { users } = this
      const grouped = messages
        .reduce((acc, m) => {
          const { id, from, content, createdAt: ts, edited } = m
          const extra = m.extra || {}
          const { event } = extra
          const createdAt = moment(ts)
          if (!event && acc.length) {
            const { id: mid } = from || {}
            const { from: { id: lid }, entries, createdAtFormat: lcatf } = acc[acc.length-1]
            const hasEvents = entries.filter(({ extra = {} }) => !!extra && extra.event).length !== 0
            if (!hasEvents && lid === mid) {
              const nots = createdAt.diff(lcatf, 'minutes') < 2
              entries.push({
                id,
                content,
                createdAt: nots ? null : m.createdAt,
                edited,
                from: { id: from.id }
              })
              return acc
            }
          }
          acc.push({
            createdAt,
            from: this.findUser(from),
            entries: [{ id, content, createdAt, extra, from: { id: (from||{}).id }, edited }],
            event: event ? extra : null
          })
          return acc
        }, [])
      return grouped
    },
    onCancelEvent (message) {
    },
    async onConfirmEvent (message) {
      this.$emit('on-event-click', message)
    },
    scrollToBottom () {
      const element = this.$refs.messageWindow
      if (element) {
        element.scrollTop = element.scrollHeight
      }
    },
    onMessageWindowScroll () {
      const element = this.$refs.messageWindow
      this.hasScrolled =
        Math.abs(element.scrollTop + element.clientHeight - element.scrollHeight) > 10
    },
    onEditMessage (message) {
      this.message = message.content
      this.editing = message
    },
    abortEditing () {
      this.message = null
      this.editing = null
    },
    findUser (user) {
      return user ? (this.$storex.network.allUsers[user.id] || user) : user
    }
  }
};
</script>
<style>
.chat:hover .emojiicon {
  visibility: visible;
  transition: all;
}
.chat .emojiicon {
  visibility: hidden;
}
.arrow_icon_left {
  clip-path: polygon(100% 0, 0 0, 0 100%);
}
.arrow_icon_right {
  clip-path: polygon(100% 0, 0 0, 100% 100%);
}
</style>
