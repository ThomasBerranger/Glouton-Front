<script setup>
import {RouterLink} from "vue-router";
import {ref} from "vue";

const props = defineProps(['products', 'categoryName']);
let categoryClosed = ref(true);
</script>

<template>
  <div class="my-5 bg-white shadow">
    <div class="flex justify-between p-3 items-center w-screen" @click="categoryClosed = !categoryClosed">
      <h2>{{ categoryName }} <span class="text-xs font-bold small-indicator">{{ props.products.values.length }}</span></h2>
      <font-awesome-icon v-if="categoryClosed" icon="fa-solid fa-chevron-down"></font-awesome-icon>
      <font-awesome-icon v-else icon="fa-solid fa-chevron-up"></font-awesome-icon>
    </div>

    <div v-if="props.products.loading" class="flex justify-center items-center px-3 h-24">
      <font-awesome-icon icon="fa-solid fa-circle-notch" spin class="h-6"></font-awesome-icon>
    </div>

    <Transition mode="out-in" v-else>
      <div v-if="categoryClosed" class="relative overflow-auto px-3">
        <div class="w-full flex gap-2 snap-x overflow-x-auto pb-5">
          <div v-for="product in props.products.values" class="snap-start scroll-ml-6 shrink-0 relative" :key="product.id">

            <RouterLink :to="'/product/' + product.id">
              <img class="relative h-16 mx-auto rounded-sm"
                   :src="product.image !== '' ? product.image : '/public/logo.png'">
            </RouterLink>

          </div>
        </div>
      </div>
      <div v-else class="w-screen flex flex-wrap px-2 pb-3">

        <RouterLink v-for="product in props.products.values" :to="'/product/' + product.id">
          <img class="relative h-16 px-1 mb-2" :src="product.image">
        </RouterLink>

      </div>
    </Transition>
  </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.15s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>