<template>
  <div class="academy flex w-full h-full bg-focus text-focus-content">
    <Explorer
      class="py-8 px-6 w-1/6"
      :mode="mode"
      @mode-change="onModeChange"
    />
    <Search 
      class="grow pt-8 px-4 h-full"
      :searchResults="searchResults"
      @open="onOpenResult"
      @delete="onDeleteResult"
      v-if="isSearchMode"
    >
      <template v-slot:title>
        <h2 v-if="mode === 'search'">Discover new playgrounds</h2>
        <h2 v-if="mode === 'running'">Your running courses</h2>
      </template>
    </Search>
  </div>
</template>
<script>
import Explorer from '@/components/academy/Explorer.vue'
import Search from '@/components/academy/search/Search.vue'
export default {
  components: {
    Explorer,
    Search,
  },
  data () {
    return {
      searchResults: null,
      mode: 'search',
      coursesQuery: ''
    }
  },
  async created () {
    this.searchResults = await this.$storex.search.academyCourses()
  },
  computed: {
    isSearchMode () {
      return ['search', 'running'].indexOf(this.mode) !== -1
    }
  },
  methods: {
    async onModeChange (newMode) {
      this.mode = newMode
      if (newMode === 'search') {
        this.searchResults = await this.$storex.search.academyCourses()
      }
      if (newMode === 'running') {
        const results = Object.values(this.$storex.clinic.allClinics)
        this.searchResults = { results }
      }
    },
    async onOpenResult ({ roomName  }) {
      this.$router.push(`/academy/${roomName}`)
    },
    async onDeleteResult (result) {}
  }
}
</script>