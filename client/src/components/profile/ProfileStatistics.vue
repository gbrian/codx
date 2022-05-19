<template>
  <div class="flex flex-col gap-2">
    <div class="border-b">
      <div class="tabs w-full text-center">
        <a class="tab tab-bordered tab-active"><i class="fa-solid fa-fire mr-2"></i> Activity</a> 
        <a class="tab tab-bordered"><i class="fa-solid fa-terminal mr-2"></i> Coding clinics</a>
      </div>
    </div>
    <div>
      <div class="prose"><h2>Recent clinics</h2></div>
      <OpenClinics :head="4" />
    </div>
    <div>
      <div class="prose"><h2>Contributions</h2></div>
      <CalendarHeatmap
        :end-date="2022-12-31"
        :values="[{ date: '2022-09-22', count: 6 }]" class="w-full h-full"
        :dark-mode="true"
      />
    </div>
  </div>
</template>
<script>
import OpenClinics from '@/components/OpenClinics.vue'
import { CalendarHeatmap } from 'vue3-calendar-heatmap'
import 'vue3-calendar-heatmap'
export default {
  components: {
    OpenClinics,
    CalendarHeatmap
  },
  props: ['statistics'],
  computed: {
    activityMap () {
      return {
      }
    }
  }
}
</script>