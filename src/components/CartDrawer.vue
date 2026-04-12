<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const handleCheckout = () => {
  // 1. Close the drawer
  cartStore.closeDrawer()

  // 2. Route to the new multi-step checkout page!
  router.push('/checkout')
}

const closeAndReset = () => {
  cartStore.closeDrawer()
}

const viewFullBag = () => {
  cartStore.closeDrawer()
  router.push('/cart')
}
</script>

<template>
  <div
    v-if="cartStore.isDrawerOpen"
    @click="closeAndReset"
    class="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm transition-opacity"
  ></div>

  <div
    class="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white dark:bg-gray-950 shadow-2xl z-[101] transform transition-transform duration-500 ease-in-out flex flex-col"
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

      <div class="flex flex-col gap-3">
        <button
          @click="handleCheckout"
          class="w-full bg-black dark:bg-white text-white dark:text-black py-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
        >
          Secure Checkout
        </button>

        <button
          @click="viewFullBag"
          class="w-full bg-transparent text-black dark:text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors border border-gray-300 dark:border-gray-800"
        >
          View Full Bag
        </button>
      </div>
    </div>
  </div>
</template>
