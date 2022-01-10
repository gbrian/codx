<template>
  <div class="flex flex-col justify-between w-full text-gray-200 h-full">
    <div
      class="md:p-6 p-4 flex justify-between items-center space-x-5 border-b border-gray-900 border-opacity-20 w-full"
    >
      <div class="flex items-center">
        <ChevronLeftIcon
          @click="click"
          class="cursor-pointer w-7 ml-2 text-gray-200 mr-5 lg:hidden"
        />
        <div class="h-9 w-14 relative">
          <img
            class="md:h-9 h-8 md:w-9 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </div>
        <div class="ml-3 w-full space-x-2 flex items-center">
          <p class="md:text-md text-sm font-semibold text-gray-100">
            Doris Brown
          </p>
          <p
            class="h-0.5 w-0.5 rounded-full ring-4 ring-green-400 bg-black-400"
          />
        </div>
      </div>
      <div class="flex items-center space-x-6">
        <SearchIcon class="cursor-pointer w-5 text-gray-200" />
        <PhoneIcon class="hidden md:block cursor-pointer w-5 text-gray-200" />
        <VideoCameraIcon
          class="hidden md:block cursor-pointer w-5 text-gray-200"
        />
        <UserIcon class="hidden md:block cursor-pointer w-5 text-gray-200" />
        <Dropdown menuItemClass="right-0 top-9" imgClass="w-6" />
      </div>
    </div>
    <div class="h-full overflow-y-auto md:p-6 p-4 space-y-6">
      <div class="flex items-end justify-start">
        <div>
          <div class="h-9 w-10">
            <img
              class="h-9 w-9 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
        </div>
        <div class="flex items-start space-x-1 chat">
          <div class="ml-3 w-full flex flex-col items-start">
            <div
              class="bg-primary w-full rounded-lg rounded-bl-none text-right p-3 px-5 space-y-1"
            >
              <h3 class="text-white text-md md:text-base">Good morning</h3>
              <p class="text-gray-200 text-2xs flex items-center justify-end">
                <ClockIcon class="w-3 mr-0.5" />
                10:00
              </p>
            </div>
            <div class="arrow_icon_left bg-primary w-3 h-3"></div>

            <p class="text-sm font-medium text-gray-200">Doris Brown</p>
          </div>
          <div class="hidden md:block mt-2">
            <Dropdown
              menuItemClass="top-8"
              imgClass="w-6 transform rotate-90"
            />
          </div>
          <EmojiHappyIcon
            class="cursor-pointer md:w-7 w-5 mt-1.5 text-primary emojiicon"
          />
        </div>
      </div>
      <div class="flex items-end justify-end">
        <div class="flex space-x-1 items-start chat">
          <EmojiHappyIcon
            class="cursor-pointer md:w-6 w-4 mt-1.5 text-primary emojiicon"
          />
          <div class="hidden md:block mt-2">
            <Dropdown
              menuItemClass="top-8"
              imgClass="w-5 transform rotate-90"
            />
          </div>
          <div class="w-full flex flex-col items-end">
            <div
              class="bg-black-300 rounded-lg rounded-br-none text-left p-3 px-5 space-y-1"
            >
              <h3 class="text-white text-right text-md md:text-base">
                Good morning, How are you? What about our next meeting?
              </h3>
              <p class="text-gray-200 text-2xs flex items-center">
                <ClockIcon class="w-3 mr-0.5" />
                10:00
              </p>
            </div>
            <div class="arrow_icon_right bg-black-300 w-3 h-3"></div>
            <p class="text-sm font-medium text-gray-200">Patricia Smith</p>
          </div>
        </div>
        <div class="">
          <div class="ml-3 h-9 w-10">
            <img
              class="h-9 w-9 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="md:p-6 p-4 flex items-center md:space-x-5 space-x-3 border-t border-gray-900 border-opacity-20 w-full"
    >
      <input
        type="text"
        id="search"
        class="block w-full md:px-4 px-3 md:py-3 py-2 placeholder-gray-200 text-gray-200 focus:outline-none sm:text-base text-sm border-gray-300 rounded bg-black-300"
        placeholder="Type messages"
      />
      <EmojiHappyIcon class="cursor-pointer md:w-5 w-7 text-primary" />
      <PaperClipIcon class="cursor-pointer md:w-5 w-7 text-primary" />
      <div>
        <button
          class="bg-primary md:w-14 w-10 md:h-12 h-10 flex items-center justify-center rounded-lg"
        >
          <ChatAltIcon class="cursor-pointer md:w-6 w-5 text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ChatAltIcon,
  EmojiHappyIcon,
  UserIcon,
  SearchIcon,
  VideoCameraIcon,
  PhoneIcon,
  ClockIcon,
} from "@heroicons/vue/outline";
import { PaperClipIcon, ChevronLeftIcon } from "@heroicons/vue/solid";
import Dropdown from "./Dropdown.vue";
export default {
  components: {
    ChatAltIcon,
    EmojiHappyIcon,
    PaperClipIcon,
    UserIcon,
    SearchIcon,
    VideoCameraIcon,
    PhoneIcon,
    Dropdown,
    ClockIcon,
    ChevronLeftIcon,
  },
  props: {
    show: { type: Boolean, default: false },
    click: { type: Function },
  },
  data() {
    return {};
  },
};
</script>
<style>
.chat:hover .emojiicon {
  visibility: visible;
  transition: all;
}
.chat .emojiicon {
  visibility: hidden;
}
.arrow_icon_left {
  clip-path: polygon(100% 0, 0 0, 0 100%);
}
.arrow_icon_right {
  clip-path: polygon(100% 0, 0 0, 100% 100%);
}
</style>
