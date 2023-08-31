<script setup>
const props = defineProps(['expirationDate']);

const timeDifference = new Date(props.expirationDate) - new Date();

const daysRemaining = Math.ceil(timeDifference / (24 * 60 * 60 * 1000));
</script>

<template>
  {{ daysRemaining }} {{ daysRemaining > 1 ? 'jours restants' : 'jour restant' }}
</template>