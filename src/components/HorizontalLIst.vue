<script setup>
import {RouterLink} from "vue-router";
import {getNearestExpirationTimestampDate} from "@/functions/product";
import moment from "moment";

const props = defineProps(['products']);

function getColor(product) {
  return getNearestExpirationTimestampDate(product) <= moment().add(3, 'days').valueOf() ? 'red' : 'green';
}

function getTimeLeftForHuman(product) {
  const nearestExpirationTimestampDate = getNearestExpirationTimestampDate(product);

  let humanMessage = `${moment(nearestExpirationTimestampDate).startOf('day').from(moment().startOf('day'))}`;

  if (moment(nearestExpirationTimestampDate).startOf('day').valueOf() === moment().startOf('day').valueOf()) {
    humanMessage = 'aujourd\'hui';
  } else if (moment(nearestExpirationTimestampDate).startOf('day').valueOf() === moment().startOf('day').add(1, 'day').valueOf()) {
    humanMessage = 'demain';
  }

  return humanMessage[0].toUpperCase() + humanMessage.substring(1);
}
</script>

<template>
  <div class="mt-5 w-11/12 mx-auto list-height">

    <div v-if="props.products.loading" class="flex justify-center items-center px-3 h-24">
      <font-awesome-icon icon="fa-solid fa-circle-notch" spin class="h-6"></font-awesome-icon>
    </div>
    <div v-else-if="props.products.values.length < 1" class="flex justify-center items-center h-24">
      <h1>Aucun article</h1>
    </div>

    <RouterLink v-for="product in props.products.values" :to="'/product/' + product.id">
      <div class="grid grid-cols-12 bg-white my-3 shadow-md py-2 rounded-sm">
        <img v-if="product.image" class="relative h-16 col-span-3 place-self-center rounded-sm" :src="product.image" :alt="product.name">
        <img v-else class="relative h-16 col-span-3 place-self-center rounded-sm" src="/public/logo.png" alt="image missing">
        <div class="col-span-9 my-auto px-1 text-left">
          <p class="text-lg truncate">{{ product.name }}</p>
          <span
              :class="getColor(product) + '-color ' + getColor(product) + '-background-low-opacity px-1.5 py-1 text-xs'">{{
              getTimeLeftForHuman(product)
            }}</span>
        </div>
      </div>
    </RouterLink>

  </div>
</template>

<style scoped>
.list-height {
  height: 80vh;
  overflow-y: scroll;

  scrollbar-width: 0;
}
.list-height::-webkit-scrollbar {
  width: 0
}
</style>