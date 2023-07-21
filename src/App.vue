<script setup>
import {RouterLink, RouterView} from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld msg="Glouton"/>
    </div>
  </header>


  <RouterView />


  <footer class="fixed bottom-0 w-full pb-4">
    <div class="flex justify-evenly">
      <RouterLink to="/" class="text-2xl text-gray-400">
        <font-awesome-icon icon="fa-solid fa-utensils"/>
      </RouterLink>
      <RouterLink to="/account" class="text-2xl text-gray-400">
        <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
      </RouterLink>
    </div>
  </footer>
</template>