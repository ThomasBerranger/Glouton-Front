<script setup>
const props = defineProps(['score']);
</script>

<template>
  <p v-if="score" :class="score < 30 ? 'text-red-600' : score < 60 ? 'text-orange-600' : 'text-green-600'" class="font-bold">{{ score }} / 100</p>
  <p v-else class="text-purple-400 font-bold">?</p>
</template>