<template>
  <div class="media-player flex flex-col">
    <div class="w-full rounded-box h-1/3">
      <img :src="media.url" class="w-full" v-if="isImage" />
      <iframe
        v-else
        :src="media.url"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        class="w-full h-full"
        >
      </iframe> 
    </div>
    <div class="grow pt-2">
      <div>
        {{ media.description }}
      </div>
      <div v-for="(entry, iix) in media.index" :key="iix">
        <a class="cursor-pointer">{{ entry[0] }} - {{ entry[1] }}</a>
      </div>
    </div>
    <div class="flex gap-4 m-2">
      <button class="btn gap-2" @click="prevMedia">
        Prev
      </button>
      <button class="btn gap-2" @click="nextMedia">
        Next
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      mediaIndex: 0
    }
  },
  props: ['clinicId'],
  computed: {
    clinic () {
      return this.$storex.clinic.allClinics[this.clinicId]
    },
    media () {
      return this.clinic.media[this.mediaIndex]
    },
    isImage () {
      return this.media.type === 'image'
    }
  },
  methods: {
    prevMedia () {
      this.mediaIndex = Math.max(0, this.mediaIndex - 1)
    },
    nextMedia () {
      this.mediaIndex = Math.min(this.clinic.media.length - 1, this.mediaIndex + 1)
    }
  }
}
</script>