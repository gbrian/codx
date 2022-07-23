<template>
  <div class="header flex justify-between">
    <div class="w-2/6 relative">
      <input type="text" placeholder="Search" class="w-full input input-bordered" />
      <div class="absolute right-4 top-3">
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>
    </div>
    <div class="flex gap-2">
      <button class="btn btn-square">
        <i class="fa-solid fa-comment"></i>
      </button>
      <button class="btn btn-square">
        <i class="fa-solid fa-bell"></i>
      </button>
    </div>
  </div>
</template>