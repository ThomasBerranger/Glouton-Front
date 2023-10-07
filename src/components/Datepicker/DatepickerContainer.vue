<script setup>
import Datepicker from "@/components/Datepicker/Datepicker.vue";

const props = defineProps(['date', 'display']);
</script>

<template>
  <Transition>
    <Datepicker v-if="props.display" :date="props.date" @update-date="(newDate) => { $emit('updateDate', newDate); }"/>
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