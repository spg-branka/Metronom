<template>
  <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center text-center w-56 border border-gray-100">
    <img v-if="icon" :src="icon" alt="icon" class="w-16 h-16 mb-4 opacity-90" />
    <div v-if="!icon" class="w-16 h-16 mb-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg"></div>
    <div class="text-sm font-semibold text-text-light mb-2 uppercase tracking-wider">{{ label }}</div>
    <div class="text-3xl font-bold text-primary mb-1">{{ value }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  label: String,
  value: String,
  icon: String,
})
</script>
