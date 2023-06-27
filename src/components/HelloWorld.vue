<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <h1 class="font-title font-bold">{{ msg }}</h1>
</template>

<style scoped>

h1 {
  width: 100vw;
  text-align: center;
  font-size: 2.6rem;
}
</style>
