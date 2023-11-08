<script setup>
import router from "@/router";
import {remove} from "@/functions/product";

const props = defineProps(['suppression']);
const emit = defineEmits(['close']);
</script>

<template>
  <section>
    <div class="absolute top-0 left-0 w-screen bg-black opacity-80 min-screen-height h-full" @click="$emit('close');"></div>
    <div class="absolute-center w-10/12 mx-auto">

      <div class="flex justify-between items-center p-3">
        <div class="rounded-lg bg-white shadow-lg">
          <div class="pl-0.5 pr-2 py-3">
            <div class="flex items-center">
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-md font-medium purple-color">Attention !</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="$emit('close')"
                        class="inline-flex rounded-md bg-white purple-color">
                  <span class="sr-only">Close</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                        d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="ml-3 my-6 text-sm">
              {{ props.suppression.message }}
            </div>
            <div class="text-center">
              <button @click="remove(suppression.product).then(() => router.push('/'))"
                      class="font-medium purple-background text-white rounded-sm px-3 py-0.5">Supprimer
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>