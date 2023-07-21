<script setup>
import {RouterLink} from "vue-router";

defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="w-full flex justify-between items-baseline px-4">
    <h1 class="font-title font-bold text-4xl mt-2 text-green-800">{{ msg }}</h1>
    <RouterLink to="/about">
      <font-awesome-icon icon="fa-solid fa-barcode" class="text-3xl text-gray-600"/>
    </RouterLink>
  </div>
  <div class="w-full flex justify-between items-baseline px-4">
  </div>
</template>