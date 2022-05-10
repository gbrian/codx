<template>
  <div>
    <div class="dropdown dropdown-right dropdown-end" v-if="user">
      <UserAvatar tabindex="0" class="cursor-pointer" :user="user"/>
      <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-md w-40">
        <li>
          <a
            @click="$emit('option', 'profile')"
          >
            Profile
            <PencilAltIcon
              class="ml-3 h-4 w-4 group-hover:"
              aria-hidden="true"
            />
          </a>
        </li> 
        <li>
          <a
            @click="$router.push('/logout')"
          >
            Logout
            <LogoutIcon
              class="ml-3 h-4 w-4 group-hover:"
              aria-hidden="true"
            />
          </a>
        </li>
        <li>
          <a
            href="#"
            @click="showAbout = true"
          >
            About
            <LogoutIcon
              class="ml-3 h-4 w-4 group-hover:"
              aria-hidden="true"
            />
            <AboutDialog v-if="showAbout" @cancel="showAbout = false" />
          </a>
        </li>
      </ul>
    </div>
    <div class="avatar ring rounded-full p-2 cursor-pointer" tabindex="0"
      @click="$root.login()"
      v-else>
      <div class="w-6 h-6 rounded-full">
        <UserAddIcon :class="`hidden md:block cursor-pointer w-6`" />
      </div>
    </div>
  </div>
</template>

<script>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import { PencilAltIcon, LogoutIcon, UserAddIcon } from "@heroicons/vue/solid"
import UserAvatar from './UserAvatar.vue'
import AboutDialog from './AboutDialog.vue'

export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    PencilAltIcon,
    LogoutIcon,
    UserAddIcon,
    UserAvatar,
    AboutDialog
  },
  props: {
    imgClass: { type: String, default: "h-8 w-8 rounded-full" },
    src: { type: String, default: "../../assets/dots.svg" },
    menuItemClass: { type: String, default: "" },
  },
  data () {
    return {
      showAbout: false
    }
  },
  computed: {
    user () {
      return this.$storex.user.user
    },
    online () {
      return this.$storex.session.isOnline
    }
  }
};
</script>
