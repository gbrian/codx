<template>
  <div class="modal modal-open">
    <div class="flex flex-col modal-box relative gap-3 scrollbar-hide">
      <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-3 top-2" @click="$emit('close')">✕</label>
      <div class="flex">
        <div class="avatar flex flex-col text-center">
          <div class="w-24 h-24 rounded-full shadow-md">
            <img :src="result.user.avatar" />
          </div>
          <div>By:
            <strong>{{ result.user.username }}</strong>
          </div>
        </div>
        <div class="ml-4 prose">
          <h2>{{ result.name }}</h2>
          <h4>{{ result.description }}</h4>
          <div class="flex">
            <div class="badge badge-xs mr-1"
              v-for="(tag, tix) in result.tags" :key="tix">
              {{ tag }}
            </div>
          </div>
        </div>
      </div>
      <button class="btn btn-primary gap-2 shadow-lg">
        <i class="fa-solid fa-laptop-code shadow-md"></i>
        Run
      </button>
      <div class="relative bg-base-300 rounded-lg">
          <img :src="media.url" class="h-46 rounded-lg" v-if="media.type === 'image'" />
          <YoutubeVideoMedia :src="media.url" :title="media.name" v-if="media.type === 'youtube'" />
          <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2" @click="next" v-if="mediaVisible < (result.media.length-1)" >&gt;</label>
          <label for="my-modal-3" class="btn btn-sm btn-circle absolute left-2 top-2" @click="prev" v-if="mediaVisible" >&lt;</label>
      </div>
      <div class="flex justify-between gap-2">
        <div class="p-2 border rounded-md bg-base-100 w-1/3 text-center">
          <div>130 <i class="fa-solid fa-star"></i></div>
          <div><strong>340 Executions</strong></div>
        </div>
        <div class="p-2 border rounded-md bg-base-100 w-1/3 text-center">
          <div class="text-primary"><i class="fa-solid fa-user"></i></div>
          <div><strong>Level: pro</strong></div>
        </div>
        <div class="p-2 border rounded-md bg-base-100 w-1/3 text-center">
          <div><i class="fa-solid fa-award"></i></div>
          <div><strong>Editor's choice</strong></div>
        </div>
      </div>
      <div class="prose">
        <h3>Rating and revews</h3>
        <div class="flex flex-col -gap-2 pl-6">
          <div v-for="(rating, rtype, rix) in ratings" :key="rix"
            class="flex">
            <div>{{ rtype }}</div>
            <div class="grow">
              <progress class="ml-2 progress" :value="rating" max="100"></progress>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import YoutubeVideoMedia from '@/components/YoutubeVideoMedia.vue'
export default {
  components: {
    YoutubeVideoMedia,
  },
  props: ['result'],
  data () {
    return {
      mediaVisible: 0
    }
  },
  computed: {
    media () {
      return this.result.media[this.mediaVisible]
    },
    ratings () {
      return {
        "5": 60,
        "4": 20,
        "3": 0,
        "2": 0,
        "1": 10
      }
    }
  },
  methods: {
    prev () {
      this.mediaVisible--
    },
    next () {
      this.mediaVisible++
    }
  }
}
</script>