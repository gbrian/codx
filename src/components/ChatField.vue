<template>
  <RadioGroup class="flex flex-col" @click="click">
    <RadioGroupOption
      as="template"
      v-for="option in Options"
      :key="option"
      :value="option"
      v-slot="{ active, checked }"
    >
      <div
        :class="[
          active ? 'bg-gray-400' : '',
          checked ? 'bg-gray-400' : 'hover:bg-gray-400',
          'rounded py-3.5 px-5 flex cursor-pointer focus:outline-none items-center',
        ]"
      >
        <div class="h-9 w-12 inline-block relative">
          <img
            class="h-9 w-9 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <span
            class="absolute bottom-0.5 right-1 block h-1.5 w-1.5 rounded-full ring-1 ring-black-400 bg-green-400"
          />
        </div>
        <div class="ml-3 w-full">
          <div class="flex items-center justify-between">
            <p class="text-md font-semibold text-gray-100">{{ option.name }}</p>
            <p class="text-2xs text-gray-200">05 min</p>
          </div>
          <p class="text-sm pt-0.5 font-normal text-gray-200">
            {{ option.text }}
          </p>
        </div>
      </div>
    </RadioGroupOption>
  </RadioGroup>
</template>
<script>
// import { ref } from "vue";
import { RadioGroup, RadioGroupOption } from "@headlessui/vue";

export default {
  props: {
    Options: { type: Array, default: () => [{ name: "dsads" }] },
    click: { type: Function },
  },
  components: {
    RadioGroup,
    RadioGroupOption,
  },
};
</script>
