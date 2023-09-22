<script setup>
import {onMounted, ref} from "vue";

const messages = ['Terminé', 'Miam miam', 'J\'ai fini', 'J\'ai tout mangé'];
let message = ref('');

onMounted(() => {
  message.value = messages[Math.floor(Math.random() * messages.length)];
});
</script>

<template>
  <button class="rounded-md bg-red-400 px-2.5 py-1.5 text-sm font-medium text-white shadow-sm">{{ message }}</button>
</template>