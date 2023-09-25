<script setup>
import {RouterView} from 'vue-router';
import Header from "@/views/Layout/Header.vue";
import Footer from "@/views/Layout/Footer.vue";
</script>

<template>
  <Header/>

  <main>
    <RouterView/>
  </main>

  <Footer/>
</template>