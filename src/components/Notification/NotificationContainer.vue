<script setup>
import Notification from "@/components/Notification/Notification.vue";

const props = defineProps(['notification']);
const emit = defineEmits(['close']);
</script>

<template>
  <Transition>
    <Notification v-if="notification.show" :notification="notification" @close="$emit('close')"/>
  </Transition>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>