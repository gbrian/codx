<template>
  <div class="space-y-4">
    <h1
      class="pt-8 font-semibold md:text-4xl text-3xl text-center"
    >
      Sign up
    </h1>
    <h1
      class="md:pt-1 text-center px-3 md:px-0 md:text-xl text-lg font-medium">
      <img src="/logo.png" class="" width="80" style="margin:auto" />
    </h1>
    <h3
      class="md:pt-1 text-center px-3 md:px-0 md:text-xl text-lg font-medium "
    >
      Get your account now.
    </h3>

    <div
      class="flex flex-col justify-center sm:px-6 lg:px-8 pt-6 sm:mx-auto w-full max-w-xl"
    >
      <div
        class="w-full md:py-10 py-6 px-3 shadow sm:rounded sm:px-8  border border-gray-300"
      >
        <div
          class="space-y-3 md:py-4 pb-4 px-4"
        >
          <label
            htmlFor="username"
            class="block md:text-lg text-md font-medium "
          >
            Username
          </label>
          <div
            class="flex items-center w-full rounded-lg overflow-hidden border border-gray-300"
          >
            <div
              class="md:w-14 w-10 md:h-12 h-10 px-3 flex items-center justify-center"
            >
              <UserIcon class="cursor-pointer w-5 " />
            </div>
            <input
              v-model="identifier"
              type="text"
              class="block w-full md:px-4 px-3 md:py-3 py-2.5 placeholder-gray-200 focus:outline-none sm:text-base text-sm border-gray-300 bg-transparent font-medium"
              placeholder="Enter username"
            />
          </div>
          <label
            htmlFor="email"
            class="pt-1.5 block md:text-lg text-md font-medium "
          >
            Email
          </label>
          <div
            class="flex items-center w-full rounded-lg overflow-hidden border border-gray-300"
          >
            <div
              class="md:w-14 w-10 md:h-12 h-10 px-3 flex items-center justify-center"
            >
              <MailIcon class="cursor-pointer w-5 " />
            </div>
            <input
              v-model="email"
              type="email"
              class="block w-full md:px-4 px-3 md:py-3 py-2.5 placeholder-gray-200 focus:outline-none sm:text-base text-sm border-gray-300 bg-transparent font-medium"
              placeholder="Enter your email"
            />
          </div>
          <div v-if="false">
            <label
              class="pt-1.5 block md:text-lg text-md font-medium "
            >
              Password
            </label>

            <div
              class="flex items-center w-full rounded-lg overflow-hidden border border-gray-300"
            >
              <div
                class="md:w-14 w-10 md:h-12 h-10 px-3 flex items-center justify-center"
              >
                <LockClosedIcon class="cursor-pointer w-5 " />
              </div>
              <input
                :ref="password.ref"
                v-model="password.value"
                type="password"
                class="block w-full md:px-4 px-3 md:py-3 py-2.5 placeholder-gray-200 focus:outline-none sm:text-base text-sm border-gray-300 bg-transparent font-medium"
                placeholder="Enter your password"
                v-if="false"
              />
            </div>
          </div>
          <div>Join codx now and help us building the best coding platform!</div>
          <div class="pt-5" v-if="!thanks">
            <button
              type="submit"
              @click="onSubmit"
              class="capitalize w-full flex justify-center md:py-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium bg-primary text-primary-content hover:bg-info-600/90 focus:outline-none"
            >
              Sign up
            </button>
          </div>
          <div class="alert alert-info" v-else>
            <div class="flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
              </svg> 
              <label>Thanks, will contact you soon!</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MailIcon, LockClosedIcon, UserIcon } from "@heroicons/vue/outline";

export default {
  components: {
    MailIcon,
    LockClosedIcon,
    UserIcon,
  },
  data () {
    return {
      identifier: null,
      email: null,
      thanks: false
    }
  },
  methods: {
    async onSubmit () {
      await this.$storex.user.signup({
        identifier: this.identifier,
        email: this.email
      })
      this.thanks = true
    }
  }
};
</script>

<style></style>
