<template>
  <div class="flex flex-row">
    <ProfileUser :profile="profile" class="w-1/3" />
    <ProfileStatistics :statistics="statistics" class="grow" />
  </div>
</template>
<script>
import ProfileUser from './ProfileUser.vue'
import ProfileStatistics from './ProfileStatistics.vue'
export default {
  components: {
    ProfileUser,
    ProfileStatistics
  },
  computed: {
    profile () {
      return {
        avatar: 'https://avatars.githubusercontent.com/u/767180?v=4',
        name: 'user or org',
        alias: '@alias',
        followers: 5,
        following: 30,
        location: 'Palma de Mallorca, Spain',
        social: [
          { icon: "fa-solid fa-envelope", value: 'gustavo.brian@gmail.com' },
          { icon: "fa-brands fa-linkedin", value: 'https://www.linkedin.com/in/gustavo-brian-n%C3%BA%C3%B1ez-segade-a5710912/' },
          { icon: "fa-brands fa-github", value: 'https://github.com/gbrian' }
        ],
        achievements: [
          { icon: 'https://github.githubassets.com/images/modules/profile/badge--acv-64.png', name: 'Arctic Code Vault Contributor', description: 'Contributed code to several repositories in the 2020 GitHub Archive Program'}
        ],
        organizations: [
          { icon: 'https://avatars.githubusercontent.com/u/43237105?s=64&v=4', name: 'org1' }
        ]
      }
    },
    statistics () {
      return {
      }
    }
  }
};
</script>
