<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const cartStore = useCartStore()

// --- CHECKOUT STATE ---
// 1: Shipping, 2: Delivery, 3: Payment, 4: Success
const currentStep = ref(1)
const isProcessing = ref(false)

// --- FORM DATA ---
const shipping = ref({
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  zip: '',
})

const deliveryMethod = ref('standard') // 'standard', 'express', 'premium'
const deliveryOptions = [
  { id: 'standard', name: 'Standard Delivery', time: '3-5 Business Days', price: 0 },
  { id: 'express', name: 'Express Delivery', time: '1-2 Business Days', price: 15 },
  { id: 'premium', name: 'Premium Courier (Uber/PickMe)', time: 'Same Day', price: 25 },
]

// Modern visual card types with logos
const cardTypes = [
  {
    id: 'visa',
    label: 'Visa',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png',
  },
  {
    id: 'mastercard',
    label: 'Mastercard',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png',
  },
  {
    id: 'amex',
    label: 'Amex',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png',
  },
]

const payment = ref({
  cardType: 'visa', // Default to visa
  nameOnCard: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
})

// --- COMPUTED TOTALS ---
const deliveryCost = computed(() => {
  const method = deliveryOptions.find((d) => d.id === deliveryMethod.value)
  return method ? method.price : 0
})

const tax = computed(() => cartStore.totalPrice * 0.08) // 8% mock tax
const finalTotal = computed(() => cartStore.totalPrice + tax.value + deliveryCost.value)

// --- ACTIONS ---
const nextStep = (step: number) => {
  currentStep.value = step
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const processPayment = () => {
  isProcessing.value = true

  // Mock API Call delay
  setTimeout(() => {
    isProcessing.value = false
    currentStep.value = 4 // Move to Success Screen
    cartStore.clearCart() // Empty the cart after successful purchase
  }, 2000)
}
</script>

<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pb-20">
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
          ></path>
        </svg>
        Secure Checkout
      </div>
    </nav>

    <div v-if="currentStep === 4" class="max-w-3xl mx-auto px-4 py-24 text-center animate-fade-in">
      <div
        class="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
      >
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h2
        class="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4 tracking-tight"
      >
        Order Confirmed.
      </h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Your order #ORD-{{ Math.floor(Math.random() * 90000) + 10000 }} has been placed
        successfully. We have sent a confirmation to {{ shipping.email || 'your email' }}.
      </p>

      <div
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-sm mb-12 inline-block shadow-sm"
      >
        <p class="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
          Rewards Earned
        </p>
        <p class="text-lg font-serif font-bold text-yellow-600 dark:text-yellow-500">
          ✦ 150 Points
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="router.push('/profile')"
          class="px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity rounded-sm shadow-lg"
        >
          Track Order
        </button>
        <button
          @click="router.push('/')"
          class="px-8 py-4 bg-transparent border border-black dark:border-white text-black dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors rounded-sm"
        >
          Continue Shopping
        </button>
      </div>
    </div>

    <div
      v-else
      class="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12"
    >
      <div class="lg:col-span-7 flex flex-col gap-6">
        <div
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-sm shadow-sm transition-all duration-500"
        >
          <div class="flex justify-between items-center mb-6">
            <h3
              class="text-xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-3"
            >
              <span
                class="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs flex items-center justify-center font-sans"
                >1</span
              >
              Shipping Details
            </h3>
            <button
              v-if="currentStep > 1"
              @click="currentStep = 1"
              class="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white border-b border-gray-400"
            >
              Edit
            </button>
          </div>

          <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
            <div>
              <label
                class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2"
                >Email Address</label
              >
              <input
                v-model="shipping.email"
                type="email"
                placeholder="Email for order updates"
                class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm outline-none focus:border-black dark:focus:border-white dark:text-white transition-colors"
              />
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2"
                  >First Name</label
                >
                <input
                  v-model="shipping.firstName"
                  type="text"
                  class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm outline-none focus:border-black dark:focus:border-white dark:text-white transition-colors"
                />
              </div>
              <div>
                <label
                  class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2"
                  >Last Name</label
                >
                <input
                  v-model="shipping.lastName"
                  type="text"
                  class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm outline-none focus:border-black dark:focus:border-white dark:text-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label
                class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2"
                >Street Address</label
              >
              <input
                v-model="shipping.address"
                type="text"
                class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm outline-none focus:border-black dark:focus:border-white dark:text-white transition-colors"
              />
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2"
                  >City</label
                >
                <input
                  v-model="shipping.city"
                  type="text"
                  class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm outline-none focus:border-black dark:focus:border-white dark:text-white transition-colors"
                />
              </div>
              <div>
                <label
                  class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2"
                  >ZIP Code</label
                >
                <input
                  v-model="shipping.zip"
                  type="text"
                  class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm outline-none focus:border-black dark:focus:border-white dark:text-white transition-colors"
                />
              </div>
            </div>
            <button
              @click="nextStep(2)"
              class="w-full bg-black dark:bg-white text-white dark:text-black py-4 mt-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity rounded-sm shadow-md"
            >
              Continue to Delivery
            </button>
          </div>
        </div>

        <div
          :class="[
            'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-sm shadow-sm transition-all duration-500',
            currentStep < 2 ? 'opacity-50 pointer-events-none' : '',
          ]"
        >
          <div class="flex justify-between items-center mb-6">
            <h3
              class="text-xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-3"
            >
              <span
                class="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs flex items-center justify-center font-sans"
                >2</span
              >
              Delivery Method
            </h3>
            <button
              v-if="currentStep > 2"
              @click="currentStep = 2"
              class="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white border-b border-gray-400"
            >
              Edit
            </button>
          </div>

          <div v-if="currentStep === 2" class="space-y-4 animate-fade-in">
            <div
              v-for="option in deliveryOptions"
              :key="option.id"
              @click="deliveryMethod = option.id"
              :class="[
                'border p-4 rounded-sm cursor-pointer transition-colors flex justify-between items-center',
                deliveryMethod === option.id
                  ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-400',
              ]"
            >
              <div>
                <h4 class="text-sm font-bold dark:text-white">{{ option.name }}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ option.time }}</p>
              </div>
              <span class="text-sm font-bold dark:text-white">{{
                option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`
              }}</span>
            </div>

            <button
              @click="nextStep(3)"
              class="w-full bg-black dark:bg-white text-white dark:text-black py-4 mt-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity rounded-sm shadow-md"
            >
              Continue to Payment
            </button>
          </div>
        </div>

        <div
          :class="[
            'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-sm shadow-sm transition-all duration-500',
            currentStep < 3 ? 'opacity-50 pointer-events-none' : '',
          ]"
        >
          <h3
            class="text-xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6"
          >
            <span
              class="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs flex items-center justify-center font-sans"
              >3</span
            >
            Payment Details
          </h3>

          <div v-if="currentStep === 3" class="space-y-8 animate-fade-in">
            <div>
              <label
                class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4"
                >Select Payment Method</label
              >
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  v-for="card in cardTypes"
                  :key="card.id"
                  @click="payment.cardType = card.id"
                  type="button"
                  :class="[
                    'relative flex flex-col items-center justify-center p-4 border rounded-sm transition-all duration-300 overflow-hidden outline-none',
                    payment.cardType === card.id
                      ? 'border-black bg-gray-50 dark:border-white dark:bg-white/5 shadow-sm'
                      : 'border-gray-200 dark:border-gray-800 bg-transparent hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900',
                  ]"
                >
                  <div
                    class="absolute top-2 right-2 transition-transform duration-300"
                    :class="
                      payment.cardType === card.id ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                    "
                  >
                    <svg
                      class="w-4 h-4 text-black dark:text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <div
                    class="h-10 w-16 bg-white/90 rounded-sm flex items-center justify-center mb-3 p-1 border border-gray-100 shadow-sm"
                  >
                    <img
                      :src="card.logo"
                      :alt="card.label"
                      class="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span
                    class="text-[9px] font-bold uppercase tracking-widest text-gray-900 dark:text-white"
                    >{{ card.label }}</span
                  >
                </button>
              </div>
            </div>

            <div
              v-if="payment.cardType !== 'paypal'"
              class="animate-fade-in border border-gray-300 dark:border-gray-700 rounded-sm overflow-hidden bg-transparent flex flex-col shadow-sm"
            >
              <div
                class="p-3 border-b border-gray-300 dark:border-gray-700 relative bg-white dark:bg-gray-900/50"
              >
                <label
                  class="text-[8px] font-bold uppercase tracking-widest text-gray-400 absolute top-2 left-3"
                  >Name on Card</label
                >
                <input
                  v-model="payment.nameOnCard"
                  type="text"
                  placeholder="JOHN DOE"
                  class="w-full bg-transparent outline-none text-sm pt-4 pb-1 dark:text-white uppercase placeholder:normal-case placeholder:tracking-normal"
                />
              </div>

              <div
                class="p-3 border-b border-gray-300 dark:border-gray-700 relative bg-white dark:bg-gray-900/50"
              >
                <label
                  class="text-[8px] font-bold uppercase tracking-widest text-gray-400 absolute top-2 left-3"
                  >Card Number</label
                >
                <input
                  v-model="payment.cardNumber"
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  class="w-full bg-transparent outline-none text-sm pt-4 pb-1 font-mono tracking-widest dark:text-white"
                />

                <div
                  class="absolute right-3 top-4 h-5 w-8 bg-white rounded-sm flex items-center justify-center border border-gray-200"
                >
                  <img
                    :src="cardTypes.find((c) => c.id === payment.cardType)?.logo"
                    class="max-h-full object-contain"
                  />
                </div>
              </div>

              <div class="flex bg-white dark:bg-gray-900/50">
                <div class="w-1/2 p-3 border-r border-gray-300 dark:border-gray-700 relative">
                  <label
                    class="text-[8px] font-bold uppercase tracking-widest text-gray-400 absolute top-2 left-3"
                    >Expiry</label
                  >
                  <input
                    v-model="payment.expiry"
                    type="text"
                    placeholder="MM/YY"
                    class="w-full bg-transparent outline-none text-sm pt-4 pb-1 font-mono tracking-widest dark:text-white"
                  />
                </div>
                <div class="w-1/2 p-3 relative">
                  <label
                    class="text-[8px] font-bold uppercase tracking-widest text-gray-400 absolute top-2 left-3"
                    >CVC</label
                  >
                  <input
                    v-model="payment.cvc"
                    type="password"
                    placeholder="123"
                    class="w-full bg-transparent outline-none text-sm pt-4 pb-1 font-mono tracking-widest dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div
              v-else
              class="animate-fade-in border border-gray-200 dark:border-gray-800 rounded-sm p-8 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-900/30"
            >
              <svg
                class="w-8 h-8 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                ></path>
              </svg>
              <p class="text-sm font-bold dark:text-white mb-2">Checkout with PayPal</p>
              <p class="text-xs text-gray-500 max-w-xs">
                You will be securely redirected to PayPal to complete your purchase when you click
                Pay.
              </p>
            </div>

            <button
              @click="processPayment"
              :disabled="isProcessing"
              class="w-full bg-black dark:bg-white text-white dark:text-black py-4 mt-6 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-all flex justify-center items-center gap-2 rounded-sm shadow-md"
            >
              <span v-if="isProcessing">Processing...</span>
              <span v-else>Pay ${{ finalTotal.toFixed(2) }}</span>
            </button>
            <p
              class="text-center text-[9px] text-gray-400 uppercase tracking-widest mt-2 flex items-center justify-center gap-1"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              Encrypted & Secure
            </p>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5">
        <div
          class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-sm sticky top-8 shadow-sm"
        >
          <h3
            class="text-lg font-serif font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4"
          >
            Order Summary
          </h3>

          <div class="flex flex-col gap-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            <div v-if="cartStore.items.length === 0" class="text-sm text-gray-500 italic">
              Your cart is empty.
            </div>
            <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4 items-center">
              <div
                class="w-16 h-16 bg-white dark:bg-gray-800 flex-shrink-0 p-1 rounded-sm border border-gray-200 dark:border-gray-700"
              >
                <img
                  :src="item.thumbnail"
                  class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                />
              </div>
              <div class="flex-1">
                <h4 class="text-xs font-bold dark:text-white truncate w-40">{{ item.title }}</h4>
                <p class="text-[10px] text-gray-500 mt-1">Qty: {{ item.quantity }}</p>
              </div>
              <span class="text-xs font-bold dark:text-white"
                >${{ (item.price * item.quantity).toFixed(2) }}</span
              >
            </div>
          </div>

          <div class="flex flex-col gap-3 border-t border-gray-200 dark:border-gray-800 pt-6">
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span>{{
                deliveryCost === 0 ? 'Calculated at next step' : `$${deliveryCost.toFixed(2)}`
              }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Estimated Tax</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div
              class="flex justify-between text-lg font-serif font-bold text-gray-900 dark:text-white mt-4 border-t border-gray-200 dark:border-gray-800 pt-4"
            >
              <span>Total</span>
              <span>${{ finalTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
