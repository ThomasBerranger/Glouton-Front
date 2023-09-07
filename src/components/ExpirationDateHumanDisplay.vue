<script setup>
const props = defineProps(['expirationDate']);

const timeDifference = new Date(props.expirationDate) - new Date();

const daysRemaining = Math.ceil(timeDifference / (24 * 60 * 60 * 1000));
</script>

<template>
  <span v-if="daysRemaining > 61" class="text-green-700">Plusieurs mois restants</span>
  <span v-else-if="daysRemaining > 31" class="text-green-700">1 mois restant</span>
  <span v-else-if="daysRemaining > 21" class="text-indigo-400">3 semaines restantes</span>
  <span v-else-if="daysRemaining > 14" class="text-orange-400">2 semaines restantes</span>
  <span v-else class="text-red-400">{{ daysRemaining }} jours restants</span>
</template>