<template>
  <nav class="bg-navbar-bg border-b border-navbar-border px-4 sm:px-6 py-4 shadow-soft">
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <div class="flex items-center gap-2 sm:gap-4">
        <!-- <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-logo-gradient-from to-logo-gradient-to rounded-full flex items-center justify-center text-logo-text font-bold text-base sm:text-lg shadow-md">M</div> -->
        <h1 class="text-[clamp(0.85rem,7vw,1.5rem)] font-bold text-text whitespace-nowrap">Metronom</h1>
      </div>
      <div class="inline-flex items-center rounded-full bg-btn-inactive p-1 shadow-sm">
        <button
          @click="$emit('switch-section', 'weather')"
          :class="[
            'px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1',
            currentSection === 'weather'
              ? 'bg-btn-active text-btn-active-text focus:ring-primary-light'
              : 'bg-transparent text-btn-inactive-text hover:bg-btn-inactive-hover focus:ring-text-lighter'
          ]"
        >
          Wetter
        </button>
        <button
          @click="$emit('switch-section', 'project-info')"
          :class="[
            'px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1',
            currentSection === 'project-info'
              ? 'bg-btn-active text-btn-active-text focus:ring-primary-light'
              : 'bg-transparent text-btn-inactive-text hover:bg-btn-inactive-hover focus:ring-text-lighter'
          ]"
        >
          Uhr
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  currentSection: {
    type: String,
    default: 'weather'
  }
})

defineEmits(['switch-section'])
</script>
