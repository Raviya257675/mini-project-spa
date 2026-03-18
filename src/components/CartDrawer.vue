<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

// State to track if the user just checked out
const showCheckoutMessage = ref(false)

const handleCheckout = () => {
  showCheckoutMessage.value = true // Show the success message
  cartStore.clearCart() // Empty the cart
}

const closeAndReset = () => {
  showCheckoutMessage.value = false // Reset the message for next time
  cartStore.closeDrawer() // Slide the drawer away
}
</script>

<template>
  <div
    v-if="cartStore.isDrawerOpen"
    @click="closeAndReset"
    class="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
  ></div>

  <div
    class="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white dark:bg-gray-950 shadow-2xl z-50 transform transition-transform duration-500 ease-in-out flex flex-col"
    :class="cartStore.isDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div
      class="flex justify-between items-center p-8 border-b border-gray-100 dark:border-gray-900"
    >
      <h2 class="font-serif font-black text-2xl uppercase tracking-widest dark:text-white">
        Shopping Bag
      </h2>
      <button
        @click="closeAndReset"
        class="text-gray-400 hover:text-black dark:hover:text-white text-3xl font-light leading-none transition-colors"
      >
        &times;
      </button>
    </div>

    <div
      v-if="showCheckoutMessage"
      class="flex-1 flex flex-col items-center justify-center p-8 text-center"
    >
      <div
        class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 class="font-serif font-bold text-3xl mb-4 dark:text-white">Order Confirmed</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed text-sm">
        Since this is a simulated store, no real money was charged! Your fake order has been
        successfully placed.
      </p>
      <button
        @click="closeAndReset"
        class="border-b border-black dark:border-white pb-1 text-xs font-bold uppercase tracking-widest text-black dark:text-white hover:text-gray-500 transition-colors"
      >
        Return to Shopping
      </button>
    </div>

    <template v-else>
      <div class="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
        <div
          v-if="cartStore.items.length > 0"
          class="flex justify-end border-b border-gray-100 dark:border-gray-800 pb-4"
        >
          <button
            @click="cartStore.clearCart()"
            class="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
          >
            Empty Bag
          </button>
        </div>

        <div
          v-if="cartStore.items.length === 0"
          class="flex flex-col items-center justify-center h-full text-gray-400"
        >
          <p class="font-serif italic mb-6 text-lg">Your bag is empty.</p>
          <button
            @click="closeAndReset"
            class="border-b border-black dark:border-white pb-1 text-xs font-bold uppercase tracking-widest text-black dark:text-white hover:text-gray-500 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <div v-for="item in cartStore.items" :key="item.id" class="flex gap-6 group">
          <div class="w-24 h-32 bg-gray-100 dark:bg-gray-800 p-2 flex items-center justify-center">
            <img
              :src="item.thumbnail"
              class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
            />
          </div>
          <div class="flex-1 flex flex-col justify-center">
            <h3 class="font-bold text-sm uppercase tracking-wide dark:text-white line-clamp-1 mb-1">
              {{ item.title }}
            </h3>
            <p class="text-xs text-gray-500 uppercase tracking-widest mb-3">
              Qty: {{ item.quantity }}
            </p>
            <p class="font-serif font-bold text-lg dark:text-gray-300">${{ item.price }}</p>
          </div>
          <button
            @click="cartStore.removeFromCart(item.id)"
            class="text-gray-300 hover:text-red-500 text-xs uppercase tracking-widest self-start mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Remove
          </button>
        </div>
      </div>

      <div
        v-if="cartStore.items.length > 0"
        class="p-8 border-t border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-950"
      >
        <div class="flex justify-between items-end mb-8">
          <span class="text-xs font-bold uppercase tracking-widest text-gray-500"
            >Estimated Total</span
          >
          <span class="font-serif font-bold text-3xl dark:text-white"
            >${{ cartStore.totalPrice.toFixed(2) }}</span
          >
        </div>
        <button
          @click="handleCheckout"
          class="w-full bg-black dark:bg-white text-white dark:text-black py-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
        >
          Secure Checkout
        </button>
      </div>
    </template>
  </div>
</template>
