<template>
  <div class="flex flex-col justify-between gap-2">
      <div class="avatar">
        <div class="text-center w-20 rounded-full">
          <img :src="profile.avatar" />
        </div>
      </div>
      <div class="details prose">
        <h1>{{ profile.name }}</h1>
        <h4 class="-mt-6"><a>{{ profile.alias }}</a></h4>
      </div>
      <button class="btn btn-block btn-square bg-neutral-focus">Edit profile</button>
      <div class="network flex gap-2 prose">
        <div>
          <UserGroupIcon class="w-6" />
        </div>
        <div>Followers: <strong> {{ profile.followers }}</strong></div>
        <div>
          ·
        </div>
        <div>Following: <strong> {{ profile.following }}</strong></div>
      </div>
      <div class="contact">
        <div></div>
      </div>
      <div class="social">
        <div v-for="(social, ix) in profile.social" :key="ix">
          <i :class="social.icon"></i> <a>{{ social.value }}</a>
        </div>
      </div>
      <div class="achivements">
        <div class="prose">
          <h3>Achievements</h3>
        </div>
        <div v-for="(achievement, aix) in profile.achievements" :key="aix">
          <img :src="achievement.icon" class="w-6 h-6 float-left" />
          <div> {{ achievement.name }} </div>
        </div>
      </div>
      <div class="organizations">
        <div class="prose">
          <h3>Organizations</h3>
        </div>
        <div v-for="(org, oix) in profile.organizations" :key="oix">
          <img :src="org.icon" class="w-6 h-6 float-left" />
        </div>
      </div>
      <ThemeSelector />
    </div>
</template>
<script>
import {
  UserGroupIcon,
} from '@heroicons/vue/solid'
import ThemeSelector from '../ThemeSelector.vue'
export default {
  components: {
    UserGroupIcon,
    ThemeSelector
  },
  props: ['profile']
}
</script>