<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto h-3/3" @close="onClose">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div class="bg-base-100 text-neutral-content inline-block align-bottom  rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-2/4">
            <div class=" px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <slot name="icon">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-accent-focus sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon class="h-6 w-6 text-neutral-600" aria-hidden="true" />
                  </div>
                </slot>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <DialogTitle as="h3" class="text-lg leading-6 font-medium text-accent-900">
                    {{ title }}
                  </DialogTitle>
                  <div class="w-full">
                    <div class="text-sm text-primary-500 w-full">
                      <slot>
                      </slot>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
              <slot name="actions">
                <button class="btn btn-accent shadow-sm px-4 py-2"
                  @click="onClose(true)"
                  v-if="!btns || btns.indexOf('ok') !== -1">Ok</button> 
                <button class="btn btn-error shadow-sm px-4 py-2"
                  @click="onClose(false)"
                  v-if="!btns || btns.indexOf('cancel') !== -1">Cancel</button>
              </slot>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationIcon } from '@heroicons/vue/outline'

export default {
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    ExclamationIcon,
  },
  props: ['title', 'btns'],
  data () {
    return {
      open: true,
    }
  },
  methods: {
    onClose (ok) {
      if (ok) {
        this.$emit('ok')
      } else {
        this.$emit('close')
      }
    }
  }
}
</script>