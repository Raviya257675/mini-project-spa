<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const handleCheckout = () => {
  // MAGIC LINK: This teleports the user to the new premium checkout flow!
  router.push('/checkout')
}
</script>

<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <nav
      class="max-w-7xl mx-auto flex justify-between items-center py-6 px-4 md:px-8 border-b border-gray-200 dark:border-gray-800"
    >
      <button
        @click="router.push('/')"
        class="text-2xl font-serif font-black tracking-widest text-gray-900 dark:text-white uppercase"
      >
        E-Buy
      </button>
      <div
        class="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"
      >
        <svg
          class="w-4 h-4 text-black dark:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          ></path>
        </svg>
        Shopping Bag
      </div>
    </nav>

    <div class="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <h1
        class="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-12 tracking-tight"
      >
        Your Bag.
      </h1>

      <div
        v-if="cartStore.items.length === 0"
        class="text-center py-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-sm"
      >
        <p
          class="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-widest font-bold mb-6"
        >
          Your collection is currently empty.
        </p>
        <button
          @click="router.push('/')"
          class="bg-black dark:bg-white text-white dark:text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity shadow-lg"
        >
          Discover The Catalog
        </button>
      </div>

      <div
        v-else
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm overflow-hidden"
      >
        <ul class="divide-y divide-gray-100 dark:divide-gray-800">
          <li
            v-for="item in cartStore.items"
            :key="item.id"
            class="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div class="flex items-center gap-6 w-full sm:w-auto">
              <div
                class="w-24 h-24 bg-gray-100 dark:bg-gray-800 p-2 rounded-sm border border-gray-100 dark:border-gray-700 flex-shrink-0"
              >
                <img
                  :src="item.thumbnail"
                  :alt="item.title"
                  class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                />
              </div>

              <div class="flex flex-col gap-1">
                <h3 class="text-lg font-serif font-bold text-gray-900 dark:text-white">
                  {{ item.title }}
                </h3>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Unit Price: ${{ item.price.toFixed(2) }}
                </p>
                <div
                  class="mt-2 inline-flex items-center border border-gray-200 dark:border-gray-700 rounded-sm"
                >
                  <span
                    class="px-3 py-1 text-xs font-bold dark:text-white border-r border-gray-200 dark:border-gray-700"
                    >QTY</span
                  >
                  <span
                    class="px-3 py-1 text-xs font-bold text-black dark:text-white bg-gray-50 dark:bg-gray-800"
                    >{{ item.quantity }}</span
                  >
                </div>
              </div>
            </div>

            <div
              class="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4"
            >
              <span class="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </span>
              <button
                @click="cartStore.removeFromCart(item.id)"
                class="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 border-b border-transparent hover:border-red-700 transition-colors pb-0.5"
              >
                Remove Item
              </button>
            </div>
          </li>
        </ul>

        <div
          class="p-6 md:p-8 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-6"
        >
          <div class="text-center sm:text-left">
            <span class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1"
              >Subtotal</span
            >
            <span class="text-3xl font-serif font-black text-gray-900 dark:text-white">
              ${{ cartStore.totalPrice.toFixed(2) }}
            </span>
            <p class="text-[9px] uppercase tracking-widest text-gray-400 mt-2">
              Shipping & Taxes calculated at checkout
            </p>
          </div>

          <button
            @click="handleCheckout"
            class="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black px-10 py-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity shadow-lg flex justify-center items-center gap-3"
          >
            Proceed to Checkout
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="cartStore.items.length > 0" class="mt-8 text-center sm:text-left">
        <button
          @click="router.push('/')"
          class="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white border-b border-transparent hover:border-black dark:hover:border-white transition-colors pb-1"
        >
          &larr; Continue Shopping
        </button>
      </div>
    </div>
  </main>
</template>
