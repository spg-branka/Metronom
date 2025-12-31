<template>
  <footer class="bg-white border-t border-gray-200 text-center py-6 mt-auto shadow-soft">
    <!-- <p class="text-text-light text-sm">© {{ currentYear }} Metronom</p> -->
    <p class="text-text-light text-sm">2025/26 Metronom</p>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const currentYear = new Date().getFullYear()
</script>
