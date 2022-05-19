import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { $storex } from '@/store'
import api from '@/api'

export const namespaced = true

export const state = () => ({
  currentSearch: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setCurrentSearch (state, search) {
    state.currentSearch = search
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    },
    async doSearch (ctx, query = {}) {
      const { data: results } = await api.search(query)
      $storex.search.setCurrentSearch({
        query,
        results
      })
    },
    async academyCourses (ctx, query = {}) {
      await $storex.search.doSearch({ ...query, searchType: 'academy' })
      const { currentSearch } = $storex.search
      const results = [
        'https://i.ytimg.com/vi/rfscVS0vtbw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLABBQtpk83-Gm8-IgPAiGlTtrLH9w',
        'https://i.ytimg.com/vi/wDIQ17T3sRk/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCUasho5kBu25lowid1F5e9pfTyNw',
        'https://i.ytimg.com/vi/esX7SFtEjHg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCD8mvtnRms6oId-LL62pB7mRz-zw',
        'https://i.ytimg.com/an_webp/wDIQ17T3sRk/mqdefault_6s.webp?du=3000&sqp=CNT3yo8G&rs=AOn4CLA_r_N-3ERl_ElTSRSpu12TL5K9vQ',
        'https://i.ytimg.com/vi/I-k-iTUMQAY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLA8to4KTlPsGQyiaLFEV7KR61Bxkw',
        'https://i.ytimg.com/vi/N7ZmPYaXoic/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDT6u4Jv1G8JZc6I_9Km5PSU5IZFQ',
        'https://i.ytimg.com/vi/5HaJPpihkBI/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCCFqj15e1jOCiE-QPhBTYviLpm5A',
        'https://i.ytimg.com/vi/MHPGeQD8TvI/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDzKmd7-5BsioY2Vae3I3maYFvMHA',
        'https://i.ytimg.com/vi/l9nh1l8ZIJQ/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC5dy2pAHtpEK6aS2vkixXIZlGwkQ',
        'https://i.ytimg.com/vi/kbKty5ZVKMY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLD9ig7IJeWqwDLhRpeJrlPYy0GkaQ',
        'https://i.ytimg.com/an_webp/MHPGeQD8TvI/mqdefault_6s.webp?du=3000&sqp=CLbiyo8G&rs=AOn4CLDAK5Gh3IkMPJolZ8Bpn-whYm6zVA',
        'https://i.ytimg.com/vi/hb7Q33ysCwI/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDnhyhqR0LolwC_2pkPEcXuI4jwkw'
      ].map(i => {
          return {
            ...currentSearch.results[0],
            media: [
              {
                "type": "image",
                "url": i
              },
            ]
          }
        })
      
      $storex.search.setCurrentSearch({
        query: currentSearch.query,
        topic: '#codx-academy',
        description: 'Find developers to connect and work together in an online development environment. A coding clinic is a timeboxed session where two or more participants will collaborate to solve a problem',
        banner: {
          bgImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8&w=1000&q=80',
          image: '/academy.jpeg',
          caption: 'https://www.ptbocanada.com/journal/2017/5/2/girl-power-national-girls-learning-code-day-comes-to-peterborough'
        },
        showWelcome: true,
        tags: results.map(r => r.tags.split(" "))
              .reduce((a, b) => a.concat(b), [])
              .filter((v, ix, arr) => arr.indexOf(v) === ix),
        results: [...currentSearch.results, ...results]
      })
      return $storex.search.currentSearch
    },
    async codingClinics (ctx, query = {}) {
      await $storex.search.doSearch({ ...query, searchType: 'clinic' })
      const { currentSearch } = $storex.search
      const results = [
        'https://i.ytimg.com/vi/rfscVS0vtbw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLABBQtpk83-Gm8-IgPAiGlTtrLH9w',
        'https://i.ytimg.com/vi/wDIQ17T3sRk/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCUasho5kBu25lowid1F5e9pfTyNw',
        'https://i.ytimg.com/vi/esX7SFtEjHg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCD8mvtnRms6oId-LL62pB7mRz-zw',
        'https://i.ytimg.com/an_webp/wDIQ17T3sRk/mqdefault_6s.webp?du=3000&sqp=CNT3yo8G&rs=AOn4CLA_r_N-3ERl_ElTSRSpu12TL5K9vQ',
        'https://i.ytimg.com/vi/I-k-iTUMQAY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLA8to4KTlPsGQyiaLFEV7KR61Bxkw',
        'https://i.ytimg.com/vi/N7ZmPYaXoic/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDT6u4Jv1G8JZc6I_9Km5PSU5IZFQ',
        'https://i.ytimg.com/vi/5HaJPpihkBI/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCCFqj15e1jOCiE-QPhBTYviLpm5A',
        'https://i.ytimg.com/vi/MHPGeQD8TvI/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDzKmd7-5BsioY2Vae3I3maYFvMHA',
        'https://i.ytimg.com/vi/l9nh1l8ZIJQ/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC5dy2pAHtpEK6aS2vkixXIZlGwkQ',
        'https://i.ytimg.com/vi/kbKty5ZVKMY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLD9ig7IJeWqwDLhRpeJrlPYy0GkaQ',
        'https://i.ytimg.com/an_webp/MHPGeQD8TvI/mqdefault_6s.webp?du=3000&sqp=CLbiyo8G&rs=AOn4CLDAK5Gh3IkMPJolZ8Bpn-whYm6zVA',
        'https://i.ytimg.com/vi/hb7Q33ysCwI/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDnhyhqR0LolwC_2pkPEcXuI4jwkw'
      ].map(i => {
          return {
            ...currentSearch.results[0],
            media: [
              {
                "type": "image",
                "url": i
              },
            ]
          }
        })
      
      $storex.search.setCurrentSearch({
        query: currentSearch.query,
        topic: '#coding-clinics',
        description: 'Find developers to connect and work together in an online development environment. A coding clinic is a timeboxed session where two or more participants will collaborate to solve a problem',
        banner: {
          bgImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8&w=1000&q=80',
          image: '/academy.jpeg',
          caption: 'https://www.ptbocanada.com/journal/2017/5/2/girl-power-national-girls-learning-code-day-comes-to-peterborough'
        },
        showWelcome: true,
        tags: results.map(r => r.tags.split(" "))
              .reduce((a, b) => a.concat(b), [])
              .filter((v, ix, arr) => arr.indexOf(v) === ix),
        results: [...currentSearch.results, ...results]
      })
      return $storex.search.currentSearch
    }
  },
)