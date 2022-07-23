<template>
  <div class="space-y-4 w-full h-full">
    <h1
      class="pt-8 font-semibold md:text-4xl text-3xl text-center"
    >
      Sign in
    </h1>
    <h1
      class="md:pt-1 text-center px-3 md:px-0 md:text-xl text-lg font-medium">
      <img src="/logo.png" class="" width="80" style="margin:auto" />
    </h1>
    <h3
      class="md:pt-1 text-center px-3 md:px-0 md:text-xl text-lg font-medium "
    >
      Sign in to continue
    </h3>

    <div
      class="flex flex-col justify-center sm:px-6 lg:px-8 pt-6 sm:mx-auto w-full max-w-xl"
    >
      <div
        class="w-full md:py-10 py-6 px-3 shadow sm:rounded sm:px-8 border border-gray-300"
      >
        <div
          class="space-y-3 md:py-4 pb-4 px-4"
        >
          <label
            htmlFor="identifier"
            class="block md:text-lg text-md font-medium "
          >
            identifier
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
              v-model="identifier"
              type="email"
              class="block w-full md:px-4 px-3 md:py-3 py-2.5 placeholder-gray-200 focus:outline-none sm:text-base text-sm border-gray-300 bg-transparent font-medium"
              placeholder="example@gmail.com"
              v-on:keyup.enter="submit"
            />
          </div>
          <span
            v-if="errorIdentifier"
            class="pt-1 block text-sm text-red-400"
            >{{ errorIdentifier }}</span
          >
          <div class="flex items-center justify-between pt-2">
            <label
              htmlFor="password"
              class="block md:text-lg text-md font-medium "
            >
              Password
            </label>
            <div class="md:text-base text-md">
              <router-link to="/reset" class="font-medium ">
                Forgot your password?
              </router-link>
            </div>
          </div>
          <div
            class="flex items-center w-full rounded-lg overflow-hidden border border-gray-300"
          >
            <div
              class="md:w-14 w-10 md:h-12 h-10 px-3 flex items-center justify-center"
            >
              <LockClosedIcon class="cursor-pointer w-5 " />
            </div>
            <input
              v-model="password"
              :type="pwdVisible ? 'text' : 'password'"
              class="block w-full md:px-4 px-3 md:py-3 py-2.5 placeholder-gray-200 focus:outline-none sm:text-base text-sm border-gray-300 bg-transparent font-medium"
              v-on:keyup.enter="submit"
              placeholder="Enter your password"
            />
            <div
              class="md:w-14 w-10 md:h-12 h-10 px-3 flex items-center justify-center"
            >
              <EyeOffIcon class="cursor-pointer w-5 " @click="pwdVisible = true" v-if="!pwdVisible"/>
              <EyeIcon class="cursor-pointer w-5 " @click="pwdVisible = false" v-else/>
            </div>
          </div>
          <span v-if="errorPassword" class="pt-1 block text-sm text-red-400">{{
            errorPassword
          }}</span>
          <div class="pt-5">
            <button
              @click="submit"
              type="submit"
              class="capitalize w-full flex justify-center md:py-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium bg-primary text-primary-content hover:bg-info-600/90 focus:outline-none"
            >
              Sign in
            </button>
          </div>
        </div>
        <br/>
        <label
          htmlFor="password"
          class="block md:text-lg text-md font-medium "
        >
           Don't have an account yet? 
          <router-link to="/signup" class="font-medium text-primary">
            Register...
          </router-link>
        </label>
        <br/>
        <label class="block md:text-lg text-md font-medium ">
          Login with...
        </label>
        <div class="flex flew-row mt-2 gap-4">
          <div class="avatar cursor-pointer w-16 h-16"
            @click="loginWithGithub"
          >
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" class="rounded-lg" />
          </div>
          <div class="avatar cursor-pointer w-16 h-16"
            v-if="false"
            @click="loginWithGoogle"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1024px-Google_%22G%22_Logo.svg.png" class="rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  MailIcon,
  LockClosedIcon,
  EyeIcon,
  EyeOffIcon
 } from "@heroicons/vue/outline";

export default {
  components: {
    MailIcon,
    LockClosedIcon,
    EyeIcon,
    EyeOffIcon
  },
  data () {
    return {
      identifier: null,
      password: null,
      errorIdentifier: null,
      errorPassword: null,
      pwdVisible: false
    }
  },
  async created () {
    let redirect = null
    const { query, params: { provider } } = this.$route
    if (provider) {
      await this.$storex.user.loginWithProvider({ ...query, provider })
      redirect = "/"
    }
    const loginRedirect = localStorage.getItem("loginRedirect")
    if (loginRedirect) {
      localStorage.removeItem("loginRedirect")
      redirect = loginRedirect
    }
    if (redirect) {
      this.$router.push(redirect)
    }
    if (query.next) {
      localStorage.setItem("loginRedirect", query.next)
    }
  },
  methods: {
    async submit () {
      const { identifier, password } = this
      await this.$storex.user.login({ identifier, password })
      const loginRedirect = localStorage.getItem("loginRedirect") || "/"
      return this.$router.push(loginRedirect)
    },
    loginWithGithub () {
      window.location = "https://api-codx.meetnav.com/api/connect/github"
    },
    loginWithGoogle () {
      window.location = "https://api-codx.meetnav.com/api/connect/google"
    }
  }
};
</script>

<style></style>
