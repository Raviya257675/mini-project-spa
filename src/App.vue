<script setup lang="ts">
import { RouterView } from 'vue-router'
import Chatbot from './components/Chatbot.vue' // 1. Import the component
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <RouterView />

    <div class="fixed bottom-6 right-6 z-50">
      <Chatbot />
    </div>
  </div>
</template>
