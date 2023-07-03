<script setup>
import {RouterLink} from "vue-router";
</script>

<template>
  <nav style="padding: 20px">
    <RouterLink to="/login" class="underline">Login</RouterLink>
    <br>
    <RouterLink to="/register" class="underline">Register</RouterLink>
  </nav>
</template>