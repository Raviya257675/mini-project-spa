<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// State toggles
const isRegistering = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// Form fields
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const toggleMode = () => {
  isRegistering.value = !isRegistering.value
  errorMsg.value = ''
  successMsg.value = ''

  if (!isRegistering.value) {
    // Clear fields when switching back to login
    email.value = ''
    password.value = ''
  } else {
    // Clear fields when switching to register
    firstName.value = ''
    lastName.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
  }
}

const handleSubmit = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  try {
    if (isRegistering.value) {
      // 1. Check if passwords match
      if (password.value !== confirmPassword.value) {
        errorMsg.value = 'Passwords do not match. Please try again.'
        return
      }

      // 2. REAL REGISTER FLOW
      // This saves them to the browser database and automatically logs them in!
      authStore.register(firstName.value, lastName.value, email.value, password.value)
      
      // 3. Redirect directly to profile
      router.push('/profile')
      
    } else {
      // 1. REAL LOGIN FLOW
      authStore.login(email.value, password.value)

      // 2. MAGIC HAPPENS HERE: Redirects to the Dashboard!
      router.push('/profile')
    }
  } catch (error: any) {
    // This catches the exact errors we wrote in auth.ts 
    // (e.g., "Invalid email or password." or "An account with this email already exists.")
    errorMsg.value = error.message || 'An error occurred. Please try again.'
  }
}
</script>

<template>
  <main class="min-h-screen bg-white dark:bg-gray-950 flex">
    <div class="hidden lg:block lg:w-1/2 relative bg-gray-100 dark:bg-gray-900">
      <img
        src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=2000"
        alt="Editorial Fashion"
        class="absolute inset-0 w-full h-full object-cover grayscale-[20%]"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div class="absolute bottom-12 left-12">
        <h2 class="font-serif text-white text-4xl uppercase tracking-widest mb-2">E-Buy Studio</h2>
        <p class="text-gray-300 text-sm tracking-widest uppercase font-semibold">
          Excellence in every detail.
        </p>
      </div>
    </div>

    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative overflow-y-auto max-h-screen"
    >
      <div class="w-full max-w-md my-auto py-8">
        <button
          @click="router.push('/')"
          class="absolute top-8 left-8 md:top-12 md:left-12 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
        >
          &larr; Back to Studio
        </button>

        <div class="mt-8 md:mt-0">
          <h1
            class="text-4xl md:text-5xl font-serif font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight transition-all"
          >
            {{ isRegistering ? 'Join Us' : 'Welcome Back' }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            {{
              isRegistering
                ? 'Create an account for exclusive access to our newest collections.'
                : 'Sign in to access your exclusive offers and track your orders.'
            }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          
          <div v-if="isRegistering" class="grid grid-cols-2 gap-6 animate-fade-in">
            <div>
              <label
                class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2"
                >First Name</label
              >
              <input
                v-model="firstName"
                type="text"
                required
                class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm focus:border-black dark:focus:border-white outline-none dark:text-white transition-colors"
                placeholder="First name"
              />
            </div>
            <div>
              <label
                class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2"
                >Last Name</label
              >
              <input
                v-model="lastName"
                type="text"
                required
                class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm focus:border-black dark:focus:border-white outline-none dark:text-white transition-colors"
                placeholder="Last name"
              />
            </div>
          </div>

          <div class="animate-fade-in">
            <label
              class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2"
              >Email Address</label
            >
            <input
              v-model="email"
              type="email"
              required
              class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm focus:border-black dark:focus:border-white outline-none dark:text-white transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 flex justify-between"
            >
              <span>Password</span>
              <a v-if="!isRegistering" href="#" class="hover:text-black dark:hover:text-white transition-colors border-b border-transparent hover:border-black dark:hover:border-white pb-0.5">Forgot?</a>
            </label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm focus:border-black dark:focus:border-white outline-none dark:text-white transition-colors font-mono tracking-widest"
              :placeholder="isRegistering ? 'Create a secure password' : 'Enter your password'"
            />
          </div>

          <div v-if="isRegistering" class="animate-fade-in">
            <label
              class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2"
              >Confirm Password</label
            >
            <input
              v-model="confirmPassword"
              type="password"
              required
              class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm focus:border-black dark:focus:border-white outline-none dark:text-white transition-colors font-mono tracking-widest"
              placeholder="Confirm your password"
            />
          </div>

          <p
            v-if="errorMsg"
            class="text-red-500 text-xs font-bold tracking-widest uppercase animate-fade-in"
          >
            {{ errorMsg }}
          </p>
          <p
            v-if="successMsg"
            class="text-emerald-500 text-xs font-bold tracking-widest uppercase animate-fade-in"
          >
            {{ successMsg }}
          </p>

          <div class="pt-6 flex flex-col gap-4">
            <button
              type="submit"
              class="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
            >
              {{ isRegistering ? 'Sign Up' : 'Sign In' }}
            </button>
            <button
              type="button"
              @click="toggleMode"
              class="w-full bg-transparent border border-black dark:border-white text-black dark:text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              {{ isRegistering ? 'Already have an account? Sign In' : 'Create Account' }}
            </button>
          </div>
        </form>
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
</style>