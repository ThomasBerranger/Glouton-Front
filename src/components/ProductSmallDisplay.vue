<script setup>
import ExpirationDateHumanDisplay from "@/components/ExpirationDateHumanDisplay.vue";
import {RouterLink} from "vue-router";

const props = defineProps(['product']);
</script>

<template>
  <RouterLink :to="'/product/' + product.id">
    <div class="w-screen flex items-center p-3">
      <img :src="product.image !== '' ? product.image : '/public/logo.webp'" class="w-14" alt="product image">
      <div class="flex-col truncate">
        <p class="pl-3 text-lg truncate">{{ product.name }}</p>
        <p class="pl-3 text-xs font-light">
          <ExpirationDateHumanDisplay :expiration-date="product.expirationDate"/>
        </p>
      </div>
    </div>
  </RouterLink>
</template>