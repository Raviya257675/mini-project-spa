<script setup lang="ts">
import { useCartStore } from '../stores/cart'
const cartStore = useCartStore()
</script>

<template>
  <Transition name="toast">
    <div
      v-if="cartStore.isToastVisible"
      class="fixed top-6 right-4 md:right-8 z-[100] w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-100 dark:border-gray-800 shadow-2xl rounded-2xl overflow-hidden"
    >
      <div class="p-4 flex items-center gap-4">
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div class="flex-1">
          <p class="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Success!</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {{ cartStore.toastMessage }}
          </p>
        </div>

        <button
          @click="cartStore.toggleDrawer()"
          class="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs font-semibold rounded-lg transition-colors flex-shrink-0"
        >
          Cart
        </button>
      </div>

      <div class="h-1 w-full bg-gray-100 dark:bg-gray-800">
        <div class="h-full bg-emerald-500 animate-progress"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Premium Slide Animation (Slides from the right like macOS) */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* 3-Second Shrinking Progress Bar */
.animate-progress {
  animation: shrink 3s linear forwards;
}

@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
