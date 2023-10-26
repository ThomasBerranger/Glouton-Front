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

    <img v-if="scores.nutriscore === 'a'" src="/public/nutriscore/A-nutriscore.svg" class="h-12" alt="a nutriscore">
    <img v-else-if="scores.nutriscore === 'b'" src="/public/nutriscore/B-nutriscore.svg" class="h-12"
         alt="b nutriscore">
    <img v-else-if="scores.nutriscore === 'c'" src="/public/nutriscore/C-nutriscore.svg" class="h-12"
         alt="c nutriscore">
    <img v-else-if="scores.nutriscore === 'd'" src="/public/nutriscore/D-nutriscore.svg" class="h-12"
         alt="d nutriscore">
    <img v-else-if="scores.nutriscore === 'e'" src="/public/nutriscore/E-nutriscore.svg" class="h-12"
         alt="e nutriscore">
    <img v-else src="/public/nutriscore/unknown-nutriscore.svg" class="h-12" alt="unknown nutriscore">

    <img v-if="scores.novagroup === 1" src="/public/novagroup/1-novagroup.svg" class="h-12" alt="1 novagroup">
    <img v-else-if="scores.novagroup === 2" src="/public/novagroup/2-novagroup.svg" class="h-12" alt="2 novagroup">
    <img v-else-if="scores.novagroup === 3" src="/public/novagroup/3-novagroup.svg" class="h-12" alt="3 novagroup">
    <img v-else-if="scores.novagroup === 4" src="/public/novagroup/4-novagroup.svg" class="h-12" alt="4 novagroup">
    <img v-else src="/public/novagroup/unknown-novagroup.svg" class="h-12" alt="unknown novagroup">

    <img v-if="scores.ecoscore === 'a'" src="/public/ecoscore/A-ecoscore.svg" class="h-12" alt="a ecoscore">
    <img v-else-if="scores.ecoscore === 'b'" src="/public/ecoscore/B-ecoscore.svg" class="h-12" alt="b ecoscore">
    <img v-else-if="scores.ecoscore === 'c'" src="/public/ecoscore/C-ecoscore.svg" class="h-12" alt="c ecoscore">
    <img v-else-if="scores.ecoscore === 'd'" src="/public/ecoscore/D-ecoscore.svg" class="h-12" alt="d ecoscore">
    <img v-else-if="scores.ecoscore === 'e'" src="/public/ecoscore/E-ecoscore.svg" class="h-12" alt="e ecoscore">
    <img v-else src="/public/ecoscore/unknown-ecoscore.svg" class="h-12" alt="unknown ecoscore">
  </div>
</template>