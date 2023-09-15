<script setup>
import ExpirationDateHumanDisplay from "@/components/ExpirationDateHumanDisplay.vue";
import {RouterLink} from "vue-router";

const props = defineProps(['product']);
</script>

<template>
  <RouterLink :to="'/product/' + product.id">

    <div class="grid grid-cols-3 py-3 px-1">
      <div class="col-span-1 mx-auto">
        <img :src="product.image !== '' ? product.image : '/public/logo.webp'" class="product-image"
             alt="product image">
      </div>
      <div class="col-span-2 grid content-center">

        <p class="pl-3 text-md truncate mb-1">{{ product.name }}</p>
        <p class="pl-3 text-xs">
          <ExpirationDateHumanDisplay :expiration-date="product.expirationDate"/>
        </p>

      </div>
    </div>

    <hr class="w-3/4 mx-auto">
  </RouterLink>
</template>