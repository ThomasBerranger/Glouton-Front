<script setup>
const props = defineProps(['product']);

const scores = {
  'nutriscore': props.product.nutriscore,
  'novagroup': props.product.novagroup,
  'ecoscore': props.product.ecoscore
};
</script>

<template>
  <div class="w-full flex justify-evenly py-4">
    <img v-for="(score, type) in scores" :src="`/public/${ type }/${ score }-${ type }.svg`" :key="type"
         :alt="type" class="h-12">
  </div>
</template>