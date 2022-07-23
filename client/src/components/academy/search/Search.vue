<template>
  <div class="search flex flex-col gap-2">
    <Header />
    <div class="prose">
      <h2>Discover new playgrounds</h2>
    </div>
    <Filters />
    <div class="mt-2 grid grid-cols-4 gap-4 grow scrollbar-hide">
      <Result
        v-for="(result, rix) in courses" :key="rix" :result="result"
        @click="resultDetail = result"
      />
    </div>
    <ResultDetail
      v-if="resultDetail"
      @close="resultDetail = null"
      :result="resultDetail" />
  </div>
</template>
<script>
import Header from './Header.vue'
import Filters from './Filters.vue'
import Result from './Result.vue'
import ResultDetail from './ResultDetail.vue'
export default {
  components: {
    Header,
    Filters,
    Result,
    ResultDetail
  },
  data () {
    return {
      showCodingClinics: null,
      resultDetail: null
    }
  },
  async created () {
    this.showCodingClinics = await this.$storex.search.academyCourses()
  },
  computed: {
    courses () {
      return this.showCodingClinics?.results.map(c => {
        return {
          image: c.media.filter(m => m.type === 'image')[0]?.url || '/codx-spaces.png',
          name: c.name,
          description: c.description,
          tags: c.tags ? c.tags.split(" ") : [],
          credits: c.creditsHour,
          user: c.user,
          media: c.media
        }
      })
    }
  }
}
</script>