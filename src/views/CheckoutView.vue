<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

// --- CHECKOUT STATE ---
const currentStep = ref(1)
const isProcessing = ref(false)
const paymentError = ref('') 

// --- OTP / 2FA STATE ---
const showOtpModal = ref(false)
const otpCode = ref('')
const otpError = ref('')
const isVerifyingOtp = ref(false)

// --- FORM DATA ---
const shipping = ref({
  email: authStore.user?.email || '',
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  address: '',
  city: '',
  zip: '',
})

const deliveryMethod = ref('standard')
const deliveryOptions = [
  { id: 'standard', name: 'Standard Delivery', time: '3-5 Business Days', price: 0 },
  { id: 'express', name: 'Express Delivery', time: '1-2 Business Days', price: 15 },
  { id: 'premium', name: 'Premium Courier (Uber/PickMe)', time: 'Same Day', price: 25 },
]

// Modern visual card types
const cardTypes = [
  { id: 'visa', label: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png' },
  { id: 'mastercard', label: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png' },
  { id: 'amex', label: 'Amex', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png' },
  { id: 'paypal', label: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png' }
]

const payment = ref({
  cardType: 'visa',
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

const tax = computed(() => cartStore.totalPrice * 0.08)
const finalTotal = computed(() => cartStore.totalPrice + tax.value + deliveryCost.value)

// --- ACTIONS ---
const nextStep = (step: number) => {
  currentStep.value = step
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const processPayment = () => {
  paymentError.value = ''

  if (payment.value.cardType !== 'paypal') {
    if (
      !payment.value.nameOnCard ||
      !payment.value.cardNumber ||
      !payment.value.expiry ||
      !payment.value.cvc
    ) {
      paymentError.value = 'Please fill in all payment details to complete your order.'
      return 
    }
  }

  isProcessing.value = true

  setTimeout(() => {
    isProcessing.value = false
    showOtpModal.value = true
  }, 1500)
}

const verifyOtp = () => {
  otpError.value = ''

  if (otpCode.value !== '0000') {
    otpError.value = 'Invalid verification code. Please check and try again.'
    return
  }

  isVerifyingOtp.value = true

  setTimeout(() => {
    isVerifyingOtp.value = false
    showOtpModal.value = false
    currentStep.value = 4
    
    // THIS IS THE CRITICAL FIX: Save the order to the user's profile
    if (authStore.isAuthenticated) {
      authStore.placeOrder(cartStore.items, finalTotal.value)
    }
    
    // Clear the cart successfully
    cartStore.clearCart() 
  }, 1500)
}
</script>

<template>
  <main class="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-300 pb-24 relative">
    
    <nav class="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-900 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto flex justify-between items-center py-5 px-4 md:px-8">
        <button @click="router.push('/')" class="text-2xl font-serif font-black tracking-widest text-gray-900 dark:text-white uppercase flex items-center gap-3">
           <img src="../assets/logo.avif" alt="E-Buy Logo" class="h-7 w-auto object-contain" />
           E-Buy
        </button>
        <div class="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <svg class="w-4 h-4 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
          Secure Checkout
        </div>
      </div>
    </nav>

    <div v-if="currentStep === 4" class="max-w-3xl mx-auto px-4 py-32 text-center animate-fade-in">
      <div class="w-24 h-24 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h2 class="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Order Confirmed.</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto text-lg font-light">
        Your order #ORD-{{ Math.floor(Math.random() * 90000) + 10000 }} has been placed successfully. A confirmation email is on its way.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button @click="router.push('/profile')" class="px-10 py-5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity rounded-sm shadow-xl">Track Order</button>
        <button @click="router.push('/')" class="px-10 py-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-black dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-sm">Continue Shopping</button>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 md:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      
      <div class="lg:col-span-7 flex flex-col gap-8">
        
        <div :class="['bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-900 p-8 md:p-10 rounded-sm shadow-sm transition-all duration-500', currentStep !== 1 ? 'opacity-70' : 'shadow-xl dark:shadow-none border-gray-200 dark:border-gray-800']">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-2xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-4">
              <span :class="['w-8 h-8 rounded-full text-xs flex items-center justify-center font-sans font-bold transition-colors', currentStep === 1 ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-400']">1</span>
              Shipping Details
            </h3>
            <button v-if="currentStep > 1" @click="currentStep = 1" class="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white border-b border-black dark:border-white pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors">Edit</button>
          </div>

          <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
            <div class="space-y-6">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Email Address</label>
                <input v-model="shipping.email" type="email" placeholder="Email for order updates" class="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 px-4 py-3.5 text-sm outline-none focus:border-black dark:focus:border-white dark:text-white transition-all rounded-sm placeholder:text-gray-400" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">First Name</label>
                  <input v-model="shipping.firstName" type="text" class="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 px-4 py-3.5 text-sm outline-none focus:border-black dark:focus:border-white dark:text-white transition-all rounded-sm" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Last Name</label>
                  <input v-model="shipping.lastName" type="text" class="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 px-4 py-3.5 text-sm outline-none focus:border-black dark:focus:border-white dark:text-white transition-all rounded-sm" />
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Street Address</label>
                <input v-model="shipping.address" type="text" placeholder="123 Luxury Ave, Suite 400" class="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 px-4 py-3.5 text-sm outline-none focus:border-black dark:focus:border-white dark:text-white transition-all rounded-sm placeholder:text-gray-400" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">City</label>
                  <input v-model="shipping.city" type="text" class="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 px-4 py-3.5 text-sm outline-none focus:border-black dark:focus:border-white dark:text-white transition-all rounded-sm" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">ZIP Code</label>
                  <input v-model="shipping.zip" type="text" class="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 px-4 py-3.5 text-sm outline-none focus:border-black dark:focus:border-white dark:text-white transition-all rounded-sm" />
                </div>
              </div>
            </div>
            <div class="pt-4">
              <button @click="nextStep(2)" class="w-full md:w-auto md:px-12 bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors rounded-sm shadow-lg">
                Continue to Delivery
              </button>
            </div>
          </div>
        </div>

        <div :class="['bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-900 p-8 md:p-10 rounded-sm shadow-sm transition-all duration-500', currentStep < 2 ? 'opacity-50 pointer-events-none' : '', currentStep === 2 ? 'shadow-xl dark:shadow-none border-gray-200 dark:border-gray-800' : '']">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-2xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-4">
              <span :class="['w-8 h-8 rounded-full text-xs flex items-center justify-center font-sans font-bold transition-colors', currentStep === 2 ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-400']">2</span>
              Delivery Method
            </h3>
            <button v-if="currentStep > 2" @click="currentStep = 2" class="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white border-b border-black dark:border-white pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors">Edit</button>
          </div>

          <div v-if="currentStep === 2" class="space-y-6 animate-fade-in">
            <div class="grid grid-cols-1 gap-4">
              <div 
                v-for="option in deliveryOptions" 
                :key="option.id"
                @click="deliveryMethod = option.id"
                :class="[
                  'relative flex items-center justify-between p-5 rounded-sm border cursor-pointer transition-all duration-300',
                  deliveryMethod === option.id
                    ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900/50 shadow-md'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] hover:border-gray-400 dark:hover:border-gray-600'
                ]"
              >
                <div class="flex items-center gap-4">
                  <div :class="['w-5 h-5 rounded-full border flex items-center justify-center transition-colors', deliveryMethod === option.id ? 'border-black dark:border-white' : 'border-gray-300 dark:border-gray-600']">
                    <div v-if="deliveryMethod === option.id" class="w-2.5 h-2.5 rounded-full bg-black dark:bg-white animate-fade-in"></div>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ option.name }}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ option.time }}</p>
                  </div>
                </div>
                <span class="text-sm font-bold text-gray-900 dark:text-white">{{ option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}` }}</span>
              </div>
            </div>

            <div class="pt-4">
              <button @click="nextStep(3)" class="w-full md:w-auto md:px-12 bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors rounded-sm shadow-lg">
                Continue to Payment
              </button>
            </div>
          </div>
        </div>

        <div :class="['bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-900 p-8 md:p-10 rounded-sm shadow-sm transition-all duration-500', currentStep < 3 ? 'opacity-50 pointer-events-none' : '', currentStep === 3 ? 'shadow-xl dark:shadow-none border-gray-200 dark:border-gray-800' : '']">
          <h3 class="text-2xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-4 mb-8">
            <span :class="['w-8 h-8 rounded-full text-xs flex items-center justify-center font-sans font-bold transition-colors', currentStep === 3 ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-400']">3</span>
            Payment Details
          </h3>

          <div v-if="currentStep === 3" class="space-y-8 animate-fade-in">
            
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Select Payment Method</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  v-for="card in cardTypes"
                  :key="card.id"
                  @click="payment.cardType = card.id"
                  type="button"
                  :class="[
                    'relative flex flex-col items-center justify-center p-5 border rounded-sm transition-all duration-300 overflow-hidden outline-none',
                    payment.cardType === card.id 
                      ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900/50 shadow-md' 
                      : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  ]"
                >
                  <div class="absolute top-2 right-2 transition-transform duration-300" :class="payment.cardType === card.id ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
                    <svg class="w-4 h-4 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  
                  <div class="h-9 w-14 bg-white/90 rounded-sm flex items-center justify-center mb-3 p-1 shadow-sm">
                    <img :src="card.logo" :alt="card.label" class="max-h-full max-w-full object-contain" />
                  </div>
                  <span class="text-[9px] font-bold uppercase tracking-widest text-gray-900 dark:text-white">{{ card.label }}</span>
                </button>
              </div>
            </div>

            <div v-if="payment.cardType !== 'paypal'" class="animate-fade-in border border-gray-200 dark:border-gray-800 rounded-sm overflow-hidden bg-white dark:bg-[#111111] shadow-sm flex flex-col focus-within:border-gray-400 dark:focus-within:border-gray-600 transition-colors">
              <div class="p-3 border-b border-gray-200 dark:border-gray-800 relative bg-gray-50/50 dark:bg-gray-900/30">
                <label class="text-[8px] font-bold uppercase tracking-widest text-gray-500 absolute top-2 left-4">Name on Card</label>
                <input v-model="payment.nameOnCard" type="text" placeholder="JOHN DOE" class="w-full bg-transparent outline-none text-sm pt-5 pb-1 px-1 dark:text-white uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400" />
              </div>
              
              <div class="p-3 border-b border-gray-200 dark:border-gray-800 relative bg-gray-50/50 dark:bg-gray-900/30">
                <label class="text-[8px] font-bold uppercase tracking-widest text-gray-500 absolute top-2 left-4">Card Number</label>
                <input v-model="payment.cardNumber" type="text" placeholder="0000 0000 0000 0000" class="w-full bg-transparent outline-none text-sm pt-5 pb-1 px-1 font-mono tracking-widest dark:text-white placeholder:text-gray-400" />
                <div class="absolute right-4 top-4 h-6 w-10 bg-white rounded-sm flex items-center justify-center border border-gray-100 shadow-sm p-0.5">
                   <img :src="cardTypes.find(c => c.id === payment.cardType)?.logo" class="max-h-full object-contain" />
                </div>
              </div>
              
              <div class="flex bg-gray-50/50 dark:bg-gray-900/30">
                <div class="w-1/2 p-3 border-r border-gray-200 dark:border-gray-800 relative">
                  <label class="text-[8px] font-bold uppercase tracking-widest text-gray-500 absolute top-2 left-4">Expiry</label>
                  <input v-model="payment.expiry" type="text" placeholder="MM/YY" class="w-full bg-transparent outline-none text-sm pt-5 pb-1 px-1 font-mono tracking-widest dark:text-white placeholder:text-gray-400" />
                </div>
                <div class="w-1/2 p-3 relative">
                  <label class="text-[8px] font-bold uppercase tracking-widest text-gray-500 absolute top-2 left-4">CVC</label>
                  <input v-model="payment.cvc" type="password" placeholder="123" class="w-full bg-transparent outline-none text-sm pt-5 pb-1 px-1 font-mono tracking-widest dark:text-white placeholder:text-gray-400" />
                </div>
              </div>
            </div>
              
            <div v-else class="animate-fade-in border border-gray-200 dark:border-gray-800 rounded-sm p-10 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-gray-900/30">
              <svg class="w-10 h-10 text-gray-400 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              <p class="text-base font-bold text-gray-900 dark:text-white mb-2">Checkout with PayPal</p>
              <p class="text-xs text-gray-500 max-w-xs leading-relaxed">You will be securely redirected to PayPal to complete your purchase when you click Pay.</p>
            </div>

            <div class="pt-6 border-t border-gray-100 dark:border-gray-900">
              
              <p v-if="paymentError" class="text-red-500 text-xs font-bold uppercase tracking-widest text-center mb-6 animate-fade-in flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {{ paymentError }}
              </p>

              <button @click="processPayment" :disabled="isProcessing" class="w-full bg-black dark:bg-white text-white dark:text-black py-5 text-sm font-bold uppercase tracking-widest hover:opacity-80 transition-all flex justify-center items-center gap-3 rounded-sm shadow-xl">
                <span v-if="isProcessing" class="flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </span>
                <span v-else>Pay ${{ finalTotal.toFixed(2) }}</span>
              </button>
              <p class="text-center text-[9px] text-gray-400 uppercase tracking-widest mt-4 flex items-center justify-center gap-1.5">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
                Encrypted & Secure
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5">
        <div class="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-900 p-8 md:p-10 rounded-sm sticky top-24 shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
          <h3 class="text-xl font-serif font-bold text-gray-900 dark:text-white mb-8 flex items-center justify-between">
            Order Summary
            <span class="text-xs font-sans font-normal text-gray-500 uppercase tracking-widest">{{ cartStore.items.length }} Items</span>
          </h3>

          <div class="flex flex-col gap-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            <div v-if="cartStore.items.length === 0" class="text-sm text-gray-500 italic py-4">Your cart is empty.</div>
            <div v-for="item in cartStore.items" :key="item.id" class="flex gap-5 items-center">
              <div class="w-20 h-20 bg-gray-50 dark:bg-gray-900 flex-shrink-0 p-2 rounded-sm border border-gray-100 dark:border-gray-800">
                <img :src="item.thumbnail" class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
              </div>
              <div class="flex-1 flex flex-col justify-center">
                <h4 class="text-xs font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{{ item.title }}</h4>
                <p class="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Qty: {{ item.quantity }}</p>
                <span class="text-sm font-serif font-bold text-gray-900 dark:text-white">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4 border-t border-gray-100 dark:border-gray-800 pt-8">
            <div class="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              <span>Subtotal</span>
              <span class="text-gray-900 dark:text-white">${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              <span>Shipping</span>
              <span class="text-gray-900 dark:text-white">{{ deliveryCost === 0 ? 'Calculated next' : `$${deliveryCost.toFixed(2)}` }}</span>
            </div>
            <div class="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              <span>Estimated Tax</span>
              <span class="text-gray-900 dark:text-white">${{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-end mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
              <span class="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white">Total</span>
              <span class="text-4xl font-serif font-black text-gray-900 dark:text-white">${{ finalTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showOtpModal" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div @click="showOtpModal = false" class="absolute inset-0 backdrop-blur-md bg-black/60 transition-opacity"></div>
      <div class="relative bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 w-full max-w-md p-8 shadow-2xl rounded-sm animate-fade-in text-center">
        
        <div class="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-gray-800">
          <svg class="w-8 h-8 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>

        <h3 class="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">Security Verification</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-xs mx-auto">
          To keep your account secure, we've sent a verification code to your registered mobile number.
        </p>

        <form @submit.prevent="verifyOtp" class="flex flex-col gap-6">
          <div>
            <input 
              v-model="otpCode" 
              type="text" 
              maxlength="4"
              placeholder="Enter 4-digit code" 
              class="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 py-4 text-center text-2xl tracking-[1em] font-mono outline-none focus:border-black dark:focus:border-white transition-colors rounded-sm dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 placeholder:tracking-normal"
            />
            
            <p v-if="otpError" class="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-3 flex items-center justify-center gap-1.5 animate-fade-in">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {{ otpError }}
            </p>
            <p v-else class="text-[10px] text-gray-400 mt-3 uppercase tracking-widest font-bold">Hint: The code is 0000</p>
          </div>

          <button 
            type="submit" 
            :disabled="isVerifyingOtp"
            class="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-all flex justify-center items-center gap-2 rounded-sm shadow-lg"
          >
            <span v-if="isVerifyingOtp" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Verifying...
            </span>
            <span v-else>Confirm & Pay</span>
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
  opacity: 0;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>