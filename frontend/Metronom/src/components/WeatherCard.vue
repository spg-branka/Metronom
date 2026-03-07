<template>
  <div 
    @click="toggleExpanded" 
    class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 flex flex-col items-center text-center w-full max-w-xs mx-auto border border-gray-100 cursor-pointer sm:cursor-default"
    :class="{ 'pb-2': !isExpanded }"
  >
    <!-- Mobile: Label and Value stacked, Chevron beside them -->
    <div class="flex items-center justify-between w-full sm:block">
      <div class="flex flex-col text-left sm:text-center">
        <div class="text-xs sm:text-sm font-semibold text-text-light mb-1 sm:mb-2 uppercase tracking-wider">{{ label }}</div>
        <div class="text-xl sm:text-3xl font-bold text-primary mb-0 sm:mb-1">{{ value }}</div>
      </div>
      
      <!-- Chevron icon for mobile only -->
      <div class="sm:hidden text-gray-400 transition-transform duration-300" :class="{ 'rotate-180': isExpanded }">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Icon section - hidden on mobile when collapsed, always visible on desktop -->
    <div 
      class="w-full overflow-hidden transition-all duration-300 ease-in-out flex justify-center items-center"
      :class="isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 sm:max-h-96 sm:opacity-100 sm:mt-0'"
    >
      <TemperatureIcon v-if="label === 'Temperatur'" :value="value" class="-mb-6 mx-auto" />
      <WindSpeedIcon v-if="label === 'Windgeschwindigkeit'" :value="value" class="-mb-6 mx-auto" />
      <HumidityIcon v-if="label === 'Luftfeuchtigkeit'" :value="value" class="-mb-6 mx-auto" />
      <PressureIcon v-if="label === 'Luftdruck'" :value="value" class="-mb-6 mx-auto" />
    </div>

    <!-- <img v-if="icon" :src="icon" alt="icon" class="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 opacity-90" /> -->
    <!-- <div v-if="!icon" class="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg"></div> -->
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import TemperatureIcon from '../assets/icons/TemperatureIcon.vue'
import WindSpeedIcon from '../assets/icons/WindSpeedIcon.vue'
import HumidityIcon from '../assets/icons/HumidityIcon.vue'
import PressureIcon from '../assets/icons/PressureIcon.vue'

const props = defineProps({
  label: String,
  value: String,
  icon: String,
})

const isExpanded = ref(false)

const toggleExpanded = () => {
  // Only toggle on mobile (screen width < 640px)
  if (window.innerWidth < 640) {
    isExpanded.value = !isExpanded.value
  }
}
</script>
