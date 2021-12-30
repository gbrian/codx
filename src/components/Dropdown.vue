<template>
  <Menu as="div" class="relative text-left flex items-center">
    <div>
      <MenuButton
        class="flex items-center justify-center w-full text-sm font-medium text-gray-200 focus:outline-none"
      >
        <!-- <img class="h-8 w-8 rounded-full" :src="src" alt="" /> -->
        <img :class="imgClass" :src="src" alt="" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        :class="menuItemClass"
        class="origin-bottom-left z-50 absolute border border-gray-300 w-36 rounded-md shadow-lg bg-black-400 focus:outline-none"
      >
        <div class="py-2">
          <MenuItem v-slot="{ active }" v-for="n in 3" :key="n">
            <a
              href="#"
              :class="[
                active ? 'bg-black-300 text-gray-900' : 'text-gray-900',
                'group flex items-center justify-between transition-all font-medium hover:text-gray-500 px-6 py-1 text-md',
              ]"
            >
              Profile
              <PencilAltIcon
                class="ml-3 h-4 w-4 text-gray-900 group-hover:text-gray-500"
                aria-hidden="true"
              />
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { PencilAltIcon } from "@heroicons/vue/solid";

export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    PencilAltIcon,
  },
  props: {
    imgClass: { type: String, default: "h-8 w-8 rounded-full" },
    src: { type: String, default: require("@/assets/dots.svg") },
    menuItemClass: { type: String, default: "" },
  },
};
</script>
