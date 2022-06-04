<template>
  <Dialog>
      <template v-slot:icon>
        <div class="flex flex-col">
          <AvatarSelect
            class=""
            selectedSize="12"
            :avatars="companies"
            :selected="companySelected"
            @change="ix => companySelected = ix"/>
        </div>
      </template>
      <template v-slot:actions>
        <button :class="['btn shadow-sm px-4 py-2',
          loading ? 'loading' : '',
          canCreate ? '' : 'opacity-20 cursor-not-allowed']"
          @click="canCreate && onOk()">Create</button>
        <button class="btn shadow-sm px-4 py-2 mr-3" @click="$emit('cancel')">Cancel</button>
        <input type="text" placeholder="Promo code..." class="input input-bordered w-full max-w-xs" v-if="!newTemplate">
      </template>
      <div class="prose"><h2>New coding clininc</h2></div>
      <div class="">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Name *</span>
          </label> 
          <input v-model="name" placeholder="name" class="input input-bordered" type="text">
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Description</span>
          </label> 
          <input v-model="description" placeholder="brief description" class="input input-bordered" type="text">
        </div>

        <label class="label">
          Choose a clinic template: *
        </label>
        <div class="flex flex-row gap-1 justify-center">
          <div class="m-auto cursor-pointer grow text-center"
            v-for="(card, ix) in templates" :key="ix"
            @click="template = ix"
          >
            <div :class="['w-1/3 border-dashed border-2 rounded-lg relative m-auto',
              template === ix ? 'border-sky-500' : 'border-gray-500 opacity-60']">
              <div class="indicator-item badge badge-primary absolute top-0 left-10" v-if="template === ix + 100">Selected</div> 
              <img :src="cardImage(card)" class="w-full h-full" />
            </div>
            <h4 :class="['mt-1 text-center', template === ix ? 'text-info' : 'text-focus']"><strong>{{ card.title }}</strong></h4>
            <small>{{ card.description }}</small>
          </div>
        </div>
        <div v-if="!newTemplate">
          <label class="label cursor-pointer" @click="powerSizeShown = !powerSizeShown">
            <u class="flex">Power size 
              <ChevronDownIcon class="w-6" v-if="!powerSizeShown"/>
              <ChevronUpIcon class="w-6" v-else/>
            </u>
          </label>
          <div class="border rounded-md p-2 h-40 flex flex-col" v-if="powerSizeShown">
            <ul class="w-full steps">
              <li v-for="(size, six) in powerSizes" :key="six"
                :data-content="size.id" :class="['step cursor-pointer', powerSize >= six ? 'step-' + powerStepColor : '']" @click="powerSize = six">{{ size.name }}</li> 
            </ul>
            <div :class="'grow flex flex-col justify-between prose text-center text-' + powerStepColor">
              <div><small>{{ powerSizes[powerSize].description }}</small></div>
              <div class="flex flex-row gap-2 justify-end">
                <div class="flex flex-row gap-2">
                  <CogIcon class="w-6" />
                  <small>{{ powerSizes[powerSize].image }} / {{ powerSizes[powerSize].provider }}</small>
                </div>
                <div class="flex flex-row gap-2">
                  <ClockIcon class="w-6" />
                  <small>{{ powerSizes[powerSize].timeout }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
</template>
<script>
import {
  PlusIcon,
  CogIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/vue/outline'
import Dialog from '@/components/Dialog.vue'
import AvatarSelect from '@/components/AvatarSelect.vue'
export default {
  components: {
    PlusIcon,
    CogIcon,
    ClockIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    AvatarSelect,
    Dialog,
  },
  props: ['clinicTemplates', 'newTemplate'],
  data () {
    return {
      loading: false,
      template: 0,
      name: null,
      description: null,
      companySelected: 0,
      powerSize: 0,
      powerSizeShown: false,
      templates: this.$props.clinicTemplates || [
        {
          title: "Blank",
          description: "Empty project...",
          tags: ['nodejs', 'python', 'java'],
          media: [
            { type: 'image', url: '/logo.png' }
          ],
          credits: 100
        },
        {
          image: "codx/desktop:latest",
          title: "Desktop",
          description: "Desktop mode enabled.",
          tags: ['js', 'vue', 'react'],
          media: [
            { type: 'image', url: '/logo.png' }
          ],
          credits: 200
        },
        {
          title: "Data ML/AI",
          description: "Data anlysis project.",
          tags: ['jupyter-lab', 'tensorflow', 'conda', 'pytorch'],
          media: [
            { type: 'image', url: '/logo.png' }
          ],
          credits: 300
        }
      ]
    }
  },
  created () {
    if (this.clinicTemplates?.length === 1) {
      const { name, description } = this.clinicTemplates[0]
      this.name = name
      this.description = description
    }
  },
  computed: {
    powerStepColor () {
      if (this.powerSize >= 3) {
        return 'error'
      }
      if (this.powerSize >= 2) {
        return 'accent'
      }
      if (this.powerSize >= 1) {
        return 'success'
      }
      return 'primary'
    },
    user () {
      return this.$storex.user.user
    },
    companies () {
      const { avatar, username } = this.user
      const { subscriptions } = this.user
      const validIds = subscriptions.map(({ company }) => company)
      return [
        { avatar, name: `@${username}` },
        ...this.user.companies.filter(c => validIds.indexOf(c.id) !== -1)
      ]
    },
    subscription () {
      const { companySelected } = this
      const { subscriptions } = this.user
      if (companySelected === 0) {
        return subscriptions.filter(({ personal }) => personal)[0].subscription
      }
      const companyInfo = this.companies[companySelected]
      const res = subscriptions.filter(({ company }) => company === companyInfo.id)[0]
      return res.subscription
    },
    powerSizes () {
      return this.subscription
    },
    canCreate () {
      return this.name && this.template >= 0 && this.canPay
    },
    canPay () {
      return (this.user.credits||0) >= this.templates[this.template].credits
    }
  },
  methods: {
    onOk () {
      this.loading = true
      const roomSettings = this.powerSizes[this.powerSize]
      const template = this.templates[this.template]
      if (template.image) {
        roomSettings.image = template.image
      }
      const settings = {
        name: this.name,
        description: this.description,
        template,
        roomSettings
      }
      this.$emit('ok', settings)
    },
    cardImage (card) {
      return card.media.filter(({ type }) => type === 'image')[0].url
    }
  }
}
</script>