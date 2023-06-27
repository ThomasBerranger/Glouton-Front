<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="w-full flex justify-between items-baseline px-4">
    <h1 class="font-title font-bold text-4xl mt-2">{{ msg }}</h1>
    <font-awesome-icon icon="fa-solid fa-barcode" class="text-3xl text-gray-600"/>
  </div>
</template>

<style scoped>
</style>
