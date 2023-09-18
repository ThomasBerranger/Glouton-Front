<script setup>
import {RouterLink, RouterView} from 'vue-router';
</script>

<template>
  <header class="w-full flex justify-center items-center px-4 bg-white shadow-md">
    <RouterLink to="/">
      <h1 class="font-title font-extralight italic text-4xl">Glouton</h1>
    </RouterLink>
  </header>


  <main>
    <RouterView/>
  </main>


  <footer class="w-full flex justify-evenly items-center bg-white">
    <RouterLink to="/" class="text-2xl">
      <font-awesome-icon icon="fa-solid fa-utensils"/>
    </RouterLink>

    <RouterLink to="/scan" class="px-5 py-2 rounded-full mb-12 footer-background text-white">
      <font-awesome-icon icon="fa-solid fa-barcode" class="text-3xl"/>
    </RouterLink>

    <RouterLink to="/account" class="text-2xl">
      <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
    </RouterLink>
  </footer>
</template>