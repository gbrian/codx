<template>
  <Dialog
      @close="$emit('close')"
      @ok="$emit('ok')"
      :btns="['ok']"
      class="h-100vh"
    >
      <template v-slot:icon>
        <div class="text-center">
          <Avatar size="12" :url="template.user.avatar" />
          <button class="btn btn-sm gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            Button
          </button>
        </div>
      </template>
      <div class="h-full">
        <div class="tabs ml-4 mb-4">
          <a :class="['tab tab-bordered', tabIndex === 0 ? 'tab-active': '']"
            @click="tabIndex = 0">Overview</a> 
          <a :class="['tab tab-bordered', tabIndex === 1 ? 'tab-active': '']"
            @click="tabIndex = 1" v-if="template.readme">README</a> 
        </div>
        <div v-if="tabIndex == 0" class="h-full">
          <h1 class="prose">{{ template.name }}</h1>
          <div :class="['w-full h-80 rounded-lg', 'slide-' + slideId, iix === slideId ? '' : 'hidden']"
            v-for="(mhtml, iix) in media" :key="iix"
            v-html="mhtml">
          </div>
          <div class="flex justify-center w-full py-2 gap-2">
            <a href="#" class="btn btn-xs"
              v-for="(_, mix) in media.length" :key="mix"
              @click="slideId = mix"
            >{{ mix + 1 }}</a>
          </div>
          <div class="flex flex-row w-full">
            <div class="ml-4 flex flex-col w-full">
              <div class="flex flex-row justify-between w-full">
                <strong>{{ `@${template.user.username}` }}</strong>
                <div class="flex flex-row mr-2">
                  <ThumbUpIcon class="w-4" /> {{ template.likeCount }}
                  <ThumbDownIcon class="ml-2 w-4" /> {{ template.dislikeCount }}
                </div>
              </div>
              <small>Category 4*</small>
            </div>
          </div>
          <p class="prose">
            <span>
              {{ template.description }}
            </span>
          </p>
        </div>
        <div v-if="tabIndex === 1" class="w-full h-full pt-2 pb-6 prose scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
          <iframe border="0" :src="template.readme" class="w-full h-full" />
          <VueMarkdown :source="templateInfo" class="w-full h-full p-5" v-if="false"/>
        </div>
      </div>
      <template v-slot:actions>
        <div class="flex gap-2 justify-end py-4">
          <button class="btn btn-error shadow-sm px-4 py-2"
            @click="$emit('close')"
          >
              Close
          </button>
          <button class="btn btn-accent shadow-sm px-4 py-2 gap-2"
            @click="$emit('run', template)"
          >
            <TerminalIcon class="w-6" />
              Run...
          </button> 
        </div>
      </template>
    </Dialog>
</template>
<script>
import {
  ThumbUpIcon,
  ThumbDownIcon,
  TerminalIcon
} from '@heroicons/vue/outline'
import VueMarkdown from '@/components/VueMarkdown.vue'
import Dialog from '@/components/Dialog.vue'
import Avatar  from '@/components/Avatar.vue'
import axios from 'axios'
export default {
  components: {
    ThumbUpIcon,
    ThumbDownIcon,
    TerminalIcon,
    Dialog,
    Avatar,
    VueMarkdown
  },
  props: ['template', 'media'],
  data () {
    return {
      tabIndex: 0,
      slideId: 0,
      templateInfo: `# Test`
    }
  },
  async created () {
    const { readme } = this.template
    if (readme) {
      const { data: md } = await axios.get(this.template.readme)
      this.templateInfo = md
    }
  }

}
</script>