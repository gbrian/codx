<template>
  <div class="search flex flex-col gap-2">
    <Header />
    <div class="prose">
      <slot name="title">
      </slot>
    </div>
    <Filters />
    <div class="flex-1 flex overflow-hidden">
      <div class="pb-4 mt-2 pr-4 grid grid-cols-4 gap-4 overflow-y-scroll overflow-hidden scrollbar-thin">
        <Result
          v-for="(result, rix) in courses" :key="rix" :result="result"
          @click="resultDetail = result"
          @open="$emit('open', result)"
          @delete="$emit('delete', result)"
        />
      </div>
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
  props: ['searchResults'],
  data () {
    return {
      resultDetail: null
    }
  },
  computed: {
    courses () {
      return this.searchResults?.results.map(c => {
        return {
          ...c,
          image: c.media.filter(m => m.type === 'image')[0]?.url || '/codx-spaces.png'
        }
      })
    }
  }
}
</script>