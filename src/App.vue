<template>
  <div class="lg:flex h-screen overflow-hidden">
    <SideBar />
    <div class="bg-black-400 text-white md:p-3 p-2 py-5 h-full lg:w-96 w-full">
      <!-- <router-view /> -->
      <Chat :click="showChat" />
    </div>
    <div
      v-if="show === true"
      class="bg-black-500 lg:w-auto flex-1 lg:flex absolute lg:relative top-0 left-0 w-full h-full z-50"
    >
      <ChatBox :click="showChat" />
    </div>
    <div
      v-else
      class="bg-black-500 lg:w-auto flex-1 lg:flex hidden w-full h-full z-50"
    >
      <ChatBox />
    </div>
  </div>
</template>
<script>
import SideBar from "./components/SideBar.vue";
import ChatBox from "./components/ChatBox.vue";
import Chat from "./views/Chat.vue";
export default {
  components: {
    SideBar,
    ChatBox,
    Chat,
  },
  data() {
    return {
      show: false,
      list: [{}, {}],
    };
  },
  methods: {
    showChat() {
      this.show = !this.show;
    },
  },
};
</script>
