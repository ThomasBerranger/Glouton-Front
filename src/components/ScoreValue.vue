<script setup>
const props = defineProps(['score']);
</script>

<template>
  <p :class="score < 30 ? 'text-red-600' : score < 60 ? 'text-orange-600' : 'text-green-600'" class="font-bold">{{ score }} / 100</p>
</template>