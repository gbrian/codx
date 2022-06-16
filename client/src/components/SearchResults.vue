<template>
  <div class="flex flex-col" v-if="search">
    <div class="navbar mb-2 shadow-lg w-full flex flex-row justify-between">
      <div class="px-2 mx-2n">
        <div><span class="text-lg font-bold">{{ search.topic }}</span></div>
      </div>
    </div>
    <div class="p-2 flex gap-4">
      <div class="flex flex-row text-primary drop-shadow-sm">
        <FireIcon class="w-6 mr-2" />
        <div class="prose">
          <div>Sponsored</div>
        </div>
      </div>
      <div class="flex flex-row text-secondary drop-shadow-sm">
        <AcademicCapIcon class="w-6 mr-2" />
        <div class="prose">
          <div>Free</div>
        </div>
      </div>
      <div class="flex flex-row text-info drop-shadow-sm">
        <BeakerIcon class="w-6 mr-2" />
        <div class="prose">
          <div>Data</div>
        </div>
      </div>
      <div class="flex flex-row text-warning drop-shadow-sm">
        <CodeIcon class="w-6 mr-2" />
        <div class="prose">
          <div>Coding/Web</div>
        </div>
      </div>
    </div>

    <div class="my-2" v-if="searchString"><i>results for: {{ searchString }}</i></div>

    <div class="p-2 grid grid-cols-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
      <div class="card rounded-sm h-80 mr-4 cursor-pointer"
        v-for="(result, ix) in results" :key="ix"
      >
        <div @click="resultDialog = result" :class="[ 'relative', result.selected ? 'online border bg-red': '']">
          <div :class="['badge absolute top-1 left-1 z-10',
          result.sponsor?.id ? 'bg-primary text-primary-content' : ''
          ]"><strong>{{ result.name }}</strong></div>
          <div class="h-36 carousel rounded-sm relative"
            @mouseover="carrouselMe(result)"
            @mouseout="carrouselMe(null)"
          >
            <div class="w-full carousel-item"
              v-for="(mhtml, iix) in getResultMedia(result, true)" :key="iix"
              >
              <div v-html="mhtml" class="w-full"></div>
            </div>
            <div class="absolute w-full h-full"></div>
          </div>
          <div class="p-2 w-full text-base-content">
            <div class="flex flex-row w-full">
              <Avatar size="8" :url="result.user?.avatar" />
              <div class="ml-4 flex flex-col w-full">
                <div class="flex flex-row justify-between w-full">
                  <strong>{{ `@${result.user?.username}` }}</strong>
                  <div class="flex flex-row mr-2">
                    <ThumbUpIcon class="w-4" /> {{ result.likeCount }}
                    <ThumbDownIcon class="ml-2 w-4" /> {{ result.dislikeCount }}
                  </div>
                  <div :class="['badge badge-outline flex', bgColorPrice(result.creditsHour)]">
                    <small>{{ result.creditsHour || 100 }}</small>
                    <div class="flex -space-x-1">
                      <CurrencyDollarIcon class="w-4 float-left"
                        v-for="i in priceIndex(result.credits)"
                        :key="i"
                      />
                    </div>
                  </div>
                </div>
                <small>Category 4*</small>
              </div>
            </div>
            <div class="">
              {{ result.description }}
            </div>
          </div>
        </div>
      </div> 
    </div>
    <NewCodingClinicDialog
      v-if="newCodingClinic || newTemplate"
      :clinicTemplates="clinicTemplates"
      :newTemplate="newTemplate"
      @ok="onNewCodingClinic"
      @cancel="newTemplate = newCodingClinic = false"
    />
    <CodingClinicTemplate
      @close="resultDialog = null"
      @run="runClinicTemplate(resultDialog)"
      v-if="resultDialog"
      :template="resultDialog"
      :media="getResultMedia(resultDialog)"
    />
  </div>
</template>
<script>
import {
  ThumbUpIcon,
  ThumbDownIcon,
  PlayIcon,
  PlusCircleIcon,
  CogIcon,
  FireIcon,
  TerminalIcon,
  AcademicCapIcon,
  BeakerIcon,
  CodeIcon,
  CurrencyDollarIcon,
  PlusIcon
} from '@heroicons/vue/outline'
import Avatar from '@/components/Avatar.vue'
import NewCodingClinicDialog from '@/components/NewCodingClinicDialog.vue'
import CodingClinicTemplate from '@/components/CodingClinicTemplate.vue'
export default {
  components: {
    ThumbUpIcon,
    ThumbDownIcon,
    PlayIcon,
    TerminalIcon,
    PlusCircleIcon,
    CogIcon,
    FireIcon,
    AcademicCapIcon,
    BeakerIcon,
    CodeIcon,
    CurrencyDollarIcon,
    PlusIcon,
    Avatar,
    NewCodingClinicDialog,
    CodingClinicTemplate
  },
  data () {
    return {
      newCodingClinic: false,
      newTemplate: false,
      labelColors: [
        'primary',
        'secondary',
        'info',
        'warning',
        'teal'
      ],
      showWelcome: true,
      resultDialog: null,
      carrouselMeTarget: null,
      slidInterval: null,
      clinicTemplates: null,
      runClinicName: this.$route.params.runClinicName,
      code: this.$route.query.code
    }
  },
  mounted () {
    setTimeout(() => {
      const { runClinicName } = this
      if (runClinicName) {
        const { results } = this.$storex.search.currentSearch
        const result = results.filter(({ name }) => name === runClinicName)[0]
        result.selected = true
        if (result) {
          this.resultDialog = result
        }
      }}, 1000)
  },
  computed: {
    user () {
      return this.$storex.user.user
    },
    search () {
      const { currentSearch } = this.$storex.search
      return currentSearch
    },
    searchString () {
      const { search: { query: { q } = {}} } = this
      return q
    },
    results () {
      return this.search.results.sort(r => r.selected ? -1 : 1)
    }
  },
  methods: {
    async onNewCodingClinic (settings) {
      this.$emit('new-clinic', settings)
      this.newTemplate = false
    },
    getResultMediaVideos (result) {
      return this.getResultMedia({
        ...result,
        media: result.media.filter(({ type }) => type === 'youtube')
      })
    },
    getResultMedia (result, imagesFirst) {
      return (result.media||[])
        .sort(({ type }) => !imagesFirst || type === 'image' ? -1 : 1)
        .map(({ type, url }) => {
          if (type === 'image') {
            return `<img src="${url}" class="w-full h-full" />`
          }
          if (type === 'youtube') {
            return `<iframe src="${url}"
              class="w-full h-full"
              title="YouTube video player"
              frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`
          }
        })
        .filter(r => !!r)
    },
    resultHasVideo (result) {
      return result.media.some(({ type }) => type === 'youtube' )
    },
    runClinicTemplate (result) {
      if (!this.$root.login()) return
      this.clinicTemplates = [result]
      this.resultDialog = null
      this.newCodingClinic = true
    },
    carrouselMe(result) {
      if (this.carrouselMeTarget !== result) {
        this.carrouselMeTarget = result
        this.slideResultMedia ()
      }
    },
    slideResultMedia (shift) {
      clearTimeout(this.slidInterval)
      const { media } = this.carrouselMeTarget || {}
      if (!media || media.length === 1) {
        return
      }
      shift ? media.push(media.shift()) : setTimeout(() => media.push(media.shift()), 1000)
      this.slidInterval = setTimeout(() => this.slideResultMedia(true), 4000)
    },
    newBlankClinic () {
      this.clinicTemplates = null
      this.newCodingClinic = true
    },
    priceIndex (price) {
      return parseInt((price || 100) / 500) + 1
    },
    bgColorPrice (price) {
      return ['badge-success','badge-secondary','badge-accent','badge-warning','badge-error'][this.priceIndex(price) - 1]
    }
  }
}
</script>