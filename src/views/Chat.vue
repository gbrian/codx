<template>
  <div>
    <h1 class="text-gray-100 text-2xl font-semibold px-3.5">Chats</h1>
    <div class="relative rounded-md shadow-sm m-3.5 mt-5">
      <div
        class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"
      >
        <SearchIcon class="text-gray-200 h-5 w-5" />
      </div>
      <input
        type="text"
        id="search"
        class="block w-full px-14 py-3.5 placeholder-gray-200 text-gray-200 focus:outline-none sm:text-sm border-gray-300 rounded-lg bg-black-300"
        placeholder="Search messages or users"
      />
      <div
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <UserAddIcon class="text-gray-200 h-5 w-5" />
      </div>
    </div>
    <div
      class="grid grid-cols-4 nowrap items-center pb-2 mx-3.5 space-x-2.5 overflow-x-auto px-3 pt-6"
    >
      <div
        class="flex flex-col items-center justify-end bg-black-300 p-3.5 rounded-lg h-12 cursor-pointer"
        v-for="n in 4"
        :key="n"
      >
        <div class="h-9 w-9 inline-block relative">
          <img
            class="h-9 w-9 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <span
            class="absolute bottom-0.5 right-0.5 block h-1.5 w-1.5 rounded-full ring-1 ring-black-400 bg-green-400"
          />
        </div>
        <p class="text-xs font-semibold text-center pt-0.5 text-gray-100">
          Patrick
        </p>
      </div>
    </div>
    <h2 class="text-gray-100 text-base font-semibold p-3.5">Recent</h2>
    <div
      class="space-y-1.5 overflow-y-auto pb-12 lg:pb-0"
      style="max-height: calc(100vh - 280px)"
    >
      <ChatField :Options="list" :click="click" />
    </div>
  </div>
</template>

<script>
import ChatField from "../components/ChatField.vue";
import { SearchIcon, UserAddIcon } from "@heroicons/vue/outline";
export default {
  components: {
    ChatField,
    SearchIcon,
    UserAddIcon,
  },
  props: {
    click: { type: Function },
  },
  data() {
    return {
      list: [
        { name: "Patrick Hendricks", text: "Hey! there I'm available" },
        { name: "Steve Walker", text: "typing..." },
        { name: "Patrick Hendricks", text: "Hey! there I'm available" },
        { name: "Steve Walker", text: "typing..." },
        { name: "Patrick Hendricks", text: "Hey! there I'm available" },
        { name: "Steve Walker", text: "typing..." },
        { name: "Patrick Hendricks", text: "Hey! there I'm available" },
        { name: "Steve Walker", text: "typing..." },
        { name: "Patrick Hendricks", text: "Hey! there I'm available" },
      ],
    };
  },
};
</script>
