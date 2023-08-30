<script setup>
const props = defineProps(['product']);
</script>

<template>
  <div class="w-screen flex items-center p-3">
    <img :src="product.image !== '' ? product.image : '/public/logo.webp'" class="w-14" alt="product image">
    <p class="pl-3">{{ product.name }}</p>
  </div>
</template>