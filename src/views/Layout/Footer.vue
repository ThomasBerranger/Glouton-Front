<script setup>
import {RouterLink} from "vue-router";
</script>

<template>
  <footer class="w-full flex justify-evenly items-center bg-white">
    <RouterLink to="/" class="text-2xl">
      <font-awesome-icon icon="fa-solid fa-utensils"/>
    </RouterLink>

    <RouterLink to="/scan" class="px-5 py-2 rounded-full mb-12 green-background text-white">
      <font-awesome-icon icon="fa-solid fa-barcode" class="text-3xl"/>
    </RouterLink>

    <RouterLink to="/shopping-list" class="text-2xl">
      <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
    </RouterLink>
  </footer>
</template>
