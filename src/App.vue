<script setup>
import {RouterLink, RouterView} from 'vue-router';
</script>

<template>
  <header class="w-full flex justify-between items-center px-4 bg-white">
    <h1 class="font-title font-bold text-3xl text-green-800">Glouton</h1>
    <RouterLink to="/scan">
      <font-awesome-icon icon="fa-solid fa-barcode" class="text-3xl text-gray-600"/>
    </RouterLink>
  </header>


  <main>
    <RouterView/>
  </main>


  <footer class="w-full bg-white flex justify-evenly items-center">
    <RouterLink to="/" class="text-2xl text-gray-400">
      <font-awesome-icon icon="fa-solid fa-utensils"/>
    </RouterLink>
    <RouterLink to="/account" class="text-2xl text-gray-400">
      <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
    </RouterLink>
  </footer>
</template>