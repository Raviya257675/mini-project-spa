<script setup lang="ts">
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

// Add this new function
const handleCheckout = () => {
  alert('Processing your fake order... Thank you!')
  cartStore.items = [] // This is a bonus: it empties the cart after checking out!
}
</script>

<template>
  <main class="p-8 max-w-4xl mx-auto">
    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">Your Shopping Cart</h1>

    <div
      v-if="cartStore.items.length === 0"
      class="text-center py-16 text-gray-500 dark:text-gray-400 text-xl"
    >
      Your cart is completely empty.
      <div class="mt-4">
        <RouterLink to="/" class="text-blue-600 hover:underline font-semibold">
          &larr; Go back to the store
        </RouterLink>
      </div>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li
          v-for="item in cartStore.items"
          :key="item.id"
          class="p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div class="flex items-center gap-4 w-full sm:w-auto">
            <img
              :src="item.thumbnail"
              :alt="item.title"
              class="w-20 h-20 object-contain rounded-md bg-gray-50 dark:bg-gray-700 p-1"
            />
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ item.title }}</h3>
              <p class="text-gray-500 dark:text-gray-400">
                ${{ item.price }} x {{ item.quantity }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between w-full sm:w-auto gap-6">
            <span class="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              ${{ (item.price * item.quantity).toFixed(2) }}
            </span>
            <button
              @click="cartStore.removeFromCart(item.id)"
              class="text-red-500 hover:text-red-700 font-semibold transition-colors"
            >
              Remove
            </button>
          </div>
        </li>
      </ul>

      <div
        class="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
      >
        <span class="text-2xl font-bold text-gray-900 dark:text-white">Total:</span>
        <span class="text-3xl font-black text-emerald-600 dark:text-emerald-400">
          ${{ cartStore.totalPrice.toFixed(2) }}
        </span>
      </div>
    </div>

    <div v-if="cartStore.items.length > 0" class="mt-8 flex justify-between items-center">
      <RouterLink to="/" class="text-gray-600 dark:text-gray-300 hover:underline font-semibold">
        &larr; Continue Shopping
      </RouterLink>
      <button
        @click="handleCheckout"
        class="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors text-lg shadow-md"
      >
        Checkout Now
      </button>
    </div>
  </main>
</template>
