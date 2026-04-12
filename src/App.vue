<script setup lang="ts">
import { RouterView } from 'vue-router'
import Chatbot from './components/Chatbot.vue'
import CartDrawer from './components/CartDrawer.vue'
import ToastNotification from './components/ToastNotification.vue' // <-- 1. Import the Toast
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <RouterView />

    <CartDrawer />

    <ToastNotification />

    <div class="fixed bottom-6 right-6 z-50">
      <Chatbot />
    </div>
  </div>
</template>
