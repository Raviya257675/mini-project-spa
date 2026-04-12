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
const confirmPassword = ref('')
const username = ref('emilys') // Default user
const password = ref('emilyspass')

const toggleMode = () => {
  isRegistering.value = !isRegistering.value
  errorMsg.value = ''
  successMsg.value = ''

  if (!isRegistering.value) {
    username.value = 'emilys'
    password.value = 'emilyspass'
  } else {
    firstName.value = ''
    lastName.value = ''
    email.value = ''
    username.value = ''
    password.value = ''
    confirmPassword.value = ''
  }
}

const handleSubmit = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (isRegistering.value) {
    if (password.value !== confirmPassword.value) {
      errorMsg.value = 'Passwords do not match. Please try again.'
      return
    }

    successMsg.value = 'Account created successfully! Please sign in.'

    setTimeout(() => {
      isRegistering.value = false
      username.value = 'emilys'
      password.value = 'emilyspass'
    }, 1500)
  } else {
    // --- REAL LOGIN FLOW ---
    try {
      await authStore.login(username.value, password.value)

      // MAGIC HAPPENS HERE: Redirects to the new Dashboard!
      router.push('/profile')
    } catch (error) {
      errorMsg.value = 'Invalid credentials. Please try again.'
    }
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

          <div v-if="isRegistering" class="animate-fade-in">
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
              class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2"
              >Username</label
            >
            <input
              v-model="username"
              type="text"
              required
              class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm focus:border-black dark:focus:border-white outline-none dark:text-white transition-colors"
              :placeholder="isRegistering ? 'Choose a username' : 'Enter your username'"
            />
          </div>

          <div>
            <label
              class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2"
              >Password</label
            >
            <input
              v-model="password"
              type="password"
              required
              class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm focus:border-black dark:focus:border-white outline-none dark:text-white transition-colors"
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
              class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm focus:border-black dark:focus:border-white outline-none dark:text-white transition-colors"
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
