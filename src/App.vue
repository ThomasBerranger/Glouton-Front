<script setup>
import {RouterLink, RouterView} from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld msg="Glouton"/>

      <nav style="padding: 20px">
        <RouterLink to="/login" class="underline">Login</RouterLink>
        <br>
        <RouterLink to="/register" class="underline">Register</RouterLink>
      </nav>

    </div>
  </header>


  <RouterView/>


  <footer class="fixed bottom-0 w-full pb-4">
    <div class="flex justify-evenly">
      <RouterLink to="/">
        <font-awesome-icon icon="fa-solid fa-utensils" class="text-2xl text-gray-400"/>
      </RouterLink>
      <RouterLink to="/account">
        <font-awesome-icon icon="fa-solid fa-cart-shopping" class="text-2xl text-gray-400"/>
      </RouterLink>
    </div>
  </footer>
</template>

<style scoped lang="scss">
a.router-link-active > svg {
  @extend .text-gray-500;
}
</style>
