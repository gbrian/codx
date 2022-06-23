<template>
  <Dialog>
      <template v-slot:icon>
        <CloudUploadIcon class="w-10" />
      </template>
      <template v-slot:actions>
        <button :class="['btn shadow-sm px-4 py-2',
          loading ? 'loading' : '',
          canCreate ? '' : 'opacity-20 cursor-not-allowed']"
          @click="canCreate && onPublish()">Create</button>
        <button class="btn shadow-sm px-4 py-2 mr-3" @click="$emit('close')">Cancel</button>
        <select class="select select-bordered w-full max-w-xs" v-model="visibility">
          <option selected>public</option>
          <option>private</option>
          <option>hidden</option>
        </select>
      </template>
      <div class="prose"><h2>Publish coding clininc</h2></div>

      <div class="">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Name *</span>
          </label> 
          <input v-model="name" placeholder="name" class="input input-bordered" type="text">
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Description *</span>
          </label> 
          <input v-model="description" placeholder="brief description" class="input input-bordered" type="text">
        </div>
        <div class="form-control gap-2">
          <label class="label">
            <span class="label-text">Add media</span>
          </label> 
          <div class="flex gap-2">
            <input v-model="mediaUrl" placeholder="image or video url" class="input input-bordered grow" type="text">
            <textarea class="textarea" v-model="mediaDescription" placeholder="Media description or video index"></textarea>
            <button class="btn btn-info" @click="addMedia" >Add</button>
          </div>
          <div class="carousel carousel-center p-4 space-x-4 bg-neutral rounded-box">
            <div v-for="(item, mix) in media" :key="mix" class="carousel-item h-40 relative">
              <img :src="item.url" class="rounded-box" v-if="item.type === 'image'"/>
              <iframe
                v-if="item.type === 'youtube'"
                :src="item.url"
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
              <MinusCircleIcon class="w-6 absolute right-4 top-2 bg-red text-white cursor-pointer" @click="removeMedia(mix)" />
            </div> 
          </div>
        </div>
        <div class="flex gap-4 w-full">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Credits per hour</span>
            </label> 
            <input v-model="creditsHour" placeholder="name" class="input input-bordered" type="text">
          </div>
          <div class="form-control grow">
            <label class="label">
              <span class="label-text">Tags *</span>
            </label> 
            <input v-model="tags" placeholder="name" class="input input-bordered" type="text">
          </div>
        </div>
        <div class="form-control w-1/3 mt-4">
          <label class="label cursor-pointer">
            <span class="label-text">Users can connect with me for support</span>
            <input type="checkbox" class="toggle toggle-secondary" checked />
          </label>
        </div>
      </div>
    </Dialog>
</template>
<script>
import {
  CloudUploadIcon,
  MinusCircleIcon
} from '@heroicons/vue/outline'
import Dialog from '@/components/Dialog.vue'
const initMedia = {
        "type": "image",
        "url": "/codx-spaces.png"
      }

export default {
  components: {
    CloudUploadIcon,
    MinusCircleIcon,
    Dialog,
  },
  props: ['clinicId'],
  data() {
    return {
      name: null,
      description: null,
      tags: null,
      mediaUrl: null,
      mediaDescription: null,
      visibility: 'public',
      creditsHour: 100,
      media: [initMedia]
    }
  },
  computed: {
    clinic () {
      return this.$storex.clinic.allClinics[this.clinicId]
    },
    canCreate () {
      return this.name && this.description && this.tags
    }
  },
  methods: {
    addMedia () {
      if (!this.mediaUrl) {
        return
      }
      let mediaType = 'image'
      let url = this.mediaUrl
      if (this.mediaUrl.indexOf("youtube") !== -1) {
        mediaType = 'youtube'
        // https://www.youtube.com/watch?v=gJEfbD8DqBY
        const videoId = /v\=(.*)$/.exec(this.mediaUrl)
        if (videoId) {
          url = `https://www.youtube.com/embed/${videoId[1]}`
        }
      }
      this.media.push({
        type: mediaType,
        description: this.mediaDescription,
        url
      })
      this.mediaUrl = null
      this.mediaDescription = null
    },
    removeMedia (ix) {
      this.media.splice(ix, 1)
      if (this.media.length === 0) {
        this.media.push(initMedia)
      }
    },
    async onPublish () {
      const {
        name,
        description,
        tags,
        mediaUrl,
        visibility,
        creditsHour,
        media,
        clinicId
      } = this
      await this.$storex.clinic.createClinicTemplate({
        name,
        description,
        tags,
        mediaUrl,
        visibility,
        creditsHour,
        media,
        clinicId
      })
      this.$emit('close')
    }
  }
}
</script>