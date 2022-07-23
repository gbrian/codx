<template>
  <div class="card card-compact w-96 h-96 bg-base-200 shadow-xl cursor-pointer pb-4">
    <figure class="relative text-white h-48">
      <img class="h-full" :src="result.image" :title="result.name" />
      <div class="absolute top-0 bottom-0 left-0 right-0 bg-black opacity-40"></div>
      <div class="absolute top-2 right-4 prose text-right">
        <div class="badge badge-secondary">
          {{ result.credits }}
          <i class="ml-2 fa-solid fa-circle-dollar-to-slot"></i>
        </div>
      </div>
      <div class="absolute bottom-0 left-4 prose">
        <h3>{{ result.description }}</h3>
        <div class="badge badge-xs mr-1"
          v-for="(tag, tix) in result.tags" :key="tix">
          {{ tag }}
        </div>
      </div>
      <div class="absolute -bottom-6 card-actions justify-end -mt-10 z-100" v-if="false">
        <button class="btn btn-sm btn-accent ">Run...</button>
      </div>
    </figure>
    <div class="stats stats-vertical md:stats-horizontal grow">
      <div class="stat place-items-center gap-0 bg-transparent px-2 hover:opacity-70">
        <div class="stat-value tabular-nums">47</div>
        <div class="stat-desc">Media</div>
      </div> 
      <div class="stat place-items-center gap-0 bg-transparent px-2 hover:opacity-70">
        <div class="stat-value tabular-nums">Beginner</div>
        <div class="stat-desc">Level</div>
      </div> 
    </div>
    <div class="px-4 flex justify-between">
      <button class="btn btn-focus text-focus-content gap-2">
        <div class="avatar">
          <div class="w-8 rounded">
            <img :src="result.user.avatar" :title="result.user.username" />
          </div>
        </div>
        {{ result.user.username }}
        <div class="badge badge-secondary">
          <i class="fa-solid fa-star"></i>
          +99
        </div>
      </button>
      <button class="btn btn-square">
        <i class="fa-solid fa-star"></i>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['result']
}
</script>