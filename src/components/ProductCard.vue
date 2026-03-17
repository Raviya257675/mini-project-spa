<script setup lang="ts">
import { useCartStore } from '../stores/cart'
import type { Product } from '../types'

defineProps<{
  product: Product
}>()

const cartStore = useCartStore()
</script>

<template>
  <div class="group flex flex-col cursor-pointer">
    <div
      class="relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 overflow-hidden mb-4 flex items-center justify-center p-6"
    >
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      <div
        class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2"
      >
        <button
          @click.prevent="cartStore.addToCart(product)"
          class="flex-1 bg-black text-white py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg"
        >
          Add To Cart
        </button>
        <RouterLink
          :to="`/product/${product.id}`"
          class="flex-1 bg-white text-black py-3 text-center text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-black hover:bg-gray-100 transition-colors shadow-lg"
        >
          Details
        </RouterLink>
      </div>
    </div>

    <div class="flex justify-between items-start mt-2 px-1">
      <div>
        <h3
          class="font-bold text-sm md:text-base uppercase tracking-wide text-gray-900 dark:text-white line-clamp-1 pr-4"
        >
          {{ product.title }}
        </h3>
        <p class="text-xs text-gray-500 mt-1 capitalize">{{ product.category }}</p>
      </div>
      <p class="font-serif font-bold text-lg md:text-xl text-gray-900 dark:text-white">
        ${{ product.price }}
      </p>
    </div>
  </div>
</template>
