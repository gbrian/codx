<template>
  <div class="flex flex-row btn btn-sm dropdown dropdown-left cursor-pointer z-10" ref="main">
    <div :class="['emote', lastShown]" @click="send(lastShown)" />
    <label tabindex="0"><ChevronDownIcon class="w-6 cursor-pointer" /></label>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52" ref="list">
      <li v-for="(ids, ix) in emotes" :key="ix" class="flex flex-row gap-2">
        <a
          v-for="(id, iix) in ids" :key="iix"
          :class="['emote', id]"
          @click.prevent.stop="send(id)"
          :title="id"
        ></a>
      </li>
    </ul>
  </div>
</template>
<script>
import "@/assets/emotes/style/_emote.scss"
import {
  ChevronDownIcon
} from '@heroicons/vue/solid'
export default {
  components: {
    ChevronDownIcon
  },
  props: ['clinicId'],
  data () {
    return {
      emoteFilter: null,
      lastShown: 'wave'
    }
  },
  computed: {
    emotes () {
      function* chunks(arr, n) {
        for (let i = 0; i < arr.length; i += n) {
          yield arr.slice(i, i + n);
        }
      }
      const ids = [
        'anger',
        'bomb',
        'sleep',
        'explode',
        'sweat',
        'poo',
        'hundred',
        'alert',
        'punch',
        'wave',
        'okay',
        'thumbs-up',
        'clap',
        'prey',
        'celebrate',
        'flame',
        'goof',
        'love',
        'cool',
        'smerk',
        'worry',
        'ouch',
        'cry',
        'surprised',
        'quiet',
        'rage',
        'annoy',
        'steamed',
        'scared',
        'terrified',
        'sleepy',
        'dead',
        'happy',
        'roll-eyes',
        'thinking',
        'clown',
        'sick',
        'rofl',
        'drule',
        'sniff',
        'sus',
        'party',
        'odd',
        'hot',
        'cold',
        'blush',
        'sad'
      ]
      return [...chunks(ids, 4)]
    }
  },
  methods: {
    send (emote) {
      this.$storex.clinic.sendEmote({ clinicId: this.clinicId, emote })
      this.lastShown = emote
      this.$refs.list.blur()
    }
  }
}
</script>