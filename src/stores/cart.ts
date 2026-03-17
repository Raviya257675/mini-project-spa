import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '../types'

// We extend the Product type to include a "quantity" count
export interface CartItem extends Product {
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  // 1. STATE: Check local storage first, otherwise start empty
  const savedCart = localStorage.getItem('cart')
  const items = ref<CartItem[]>(savedCart ? JSON.parse(savedCart) : [])

  // 2. PERSISTENCE: Automatically save to local storage whenever items change
  watch(
    items,
    (newItems) => {
      localStorage.setItem('cart', JSON.stringify(newItems))
    },
    { deep: true },
  )

  // 3. GETTERS: Automatically calculate totals
  const totalItems = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const totalPrice = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0),
  )

  // 4. ACTIONS: How we modify the cart
  function addToCart(product: Product) {
    const existingItem = items.value.find((item) => item.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function removeFromCart(productId: number) {
    items.value = items.value.filter((item) => item.id !== productId)
  }

  // Expose these variables/functions to the rest of the app
  return { items, totalItems, totalPrice, addToCart, removeFromCart }
})
