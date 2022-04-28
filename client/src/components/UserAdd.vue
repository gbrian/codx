<template>
  <div class="dropdown dropdown-right">
    <div class="avatar rounded-full p-2" tabindex="0">
      <div class="w-6 h-6 rounded-full">
        <UserAddIcon :class="`hidden md:block cursor-pointer w-${size || 6}`" />
      </div>
    </div>
    <ul tabindex="0" class="ml-4 p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
      <li>
        <div class="mt-2 mb-6 w-full">
          <label class="input-group input-group-sm w-full">
            <input type="text"
              v-model="userFilter"
              placeholder="Search..." class="input input-bordered input-sm w-full" @keypress.enter="doUserSearch"> 
            <span class="cursor-pointer text-base-content" @click="doUserSearch">Go</span>
          </label>
        </div>
      </li>
      <li v-for="(user, ix) in onlineFriends" :key="ix"
        :class="['cursor-pointer', showUser(user) ? '' : 'hidden' ]"
        @click="$emit('user', user)"
      >
        <a class="flex gap-2">
          <Avatar size="8" :url="user.avatar" online class="float-left" />
          <div><strong>{{ `@${user.username}` }}</strong></div>
        </a>
      </li>
      <li v-if="pages">
        <div class="btn-group justify-center">
          <button class="btn btn-xs" v-for="(p, pix) in pages" :key="pix" @click="page = pix" >{{ pix + 1 }}</button>
        </div>
      </li>
      <hr/>
      <li @click="$emit('invite-user')">
        <a class="flex gap-2">
          <ShareIcon class="w-6" />
          <strong>Invite user</strong>
        </a>
      </li> 
    </ul>
  </div>
</template>
<script>
import { 
  UserAddIcon,
  ShareIcon
} from "@heroicons/vue/outline"
import Avatar from '@/components/Avatar.vue'
export default {
  props: ['size', 'ignoreUsers'],
  components: {
    UserAddIcon,
    ShareIcon,
    Avatar
  },
  data () {
    return {
      userFilter: null,
      page: 0,
    }
  },
  computed: {
    friendList () {
      const { friends } = this.$storex.network
      return Object.keys(friends).map(u => friends[u])
              .filter(u => this.showUser(u))
    },
    onlineFriends () {
     
      const { friendList, userFilter, page } = this
      const isFilter = userFilter?.length > 2
      
      return friendList
              .filter(u => isFilter ? (u.username.toLowerCase().indexOf(userFilter.toLowerCase()) !== -1) : true)
              .sort(u => u.online ? -1 : 1)
              .slice(page, 5)
    },
    visible () {
      return this.onlineFriends.length !== 0
    },
    pages () {
      const { friends } = this.$storex.network
      return Math.ceil(Object.keys(friends).length / 5)
    }
  },
  methods: {
    showUser (user) {
      return (this.ignoreUsers||[]).map(u => u.id).indexOf(user.id) === -1
    },
    doUserSearch () {
    }
  }
}
</script>