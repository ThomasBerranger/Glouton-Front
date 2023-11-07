<script setup>
import Suppression from "@/components/Suppression/Suppression.vue";

const props = defineProps(['suppression']);
const emit = defineEmits(['close']);
</script>

<template>
  <Transition>
    <Suppression v-if="suppression.show" :suppression="suppression" @close="$emit('close');"/>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>