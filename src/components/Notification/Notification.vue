<script setup>
import {onMounted} from "vue";

const props = defineProps(['notification']);
const emit = defineEmits(['close']);

onMounted(() => {
  setTimeout(() => {
    emit('close');
  }, props.notification.timeout)
})
</script>

<template>
    <div class="notification rounded-lg bg-white shadow-lg border-2 purple-border">
      <div class="pl-0.5 pr-2 py-3">
        <div class="flex items-center">
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-600">{{ props.notification.message }}</p>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button type="button" @click="$emit('close')"
                    class="inline-flex rounded-md bg-white purple-color">
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                    d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
</template>
