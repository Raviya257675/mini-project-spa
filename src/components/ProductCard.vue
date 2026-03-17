<script setup lang="ts">
import type { Product } from '../types'
import { useCartStore } from '../stores/cart' // Import the brain!

defineProps<{
  product: Product
}>()

const cartStore = useCartStore() // Initialize the brain
</script>

<template>
  <div
    class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all bg-white dark:bg-gray-800 flex flex-col h-full"
  >
    <div
      class="h-48 w-full bg-gray-50 dark:bg-gray-700 rounded mb-4 overflow-hidden flex items-center justify-center transition-colors"
    >
      <img :src="product.thumbnail" :alt="product.title" class="max-h-full object-contain" />
    </div>

    <h2
      class="text-lg font-bold text-gray-800 dark:text-gray-100 line-clamp-1"
      :title="product.title"
    >
      {{ product.title }}
    </h2>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">
      {{ product.category }}
    </p>

    <div class="mt-auto flex justify-between items-center gap-2">
      <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400"
        >${{ product.price }}</span
      >
      <div class="flex gap-2">
        <button
          @click="cartStore.addToCart(product)"
          class="bg-emerald-600 text-white px-3 py-2 rounded-md font-black hover:bg-emerald-700 transition-colors"
          title="Add to Cart"
        >
          +
        </button>
        <RouterLink
          :to="`/product/${product.id}`"
          class="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          Details
        </RouterLink>
      </div>
    </div>
  </div>
</template>
