
import { defineStore } from 'pinia'

import { ref, computed } from 'vue'



export const useAuthStore = defineStore('auth', () => {

  // 1. STATE: Check local storage for an existing token first

  const token = ref(localStorage.getItem('token') || '')

  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))



  // 2. GETTER: Are we logged in right now? (True if we have a token)

  const isAuthenticated = computed(() => !!token.value)



  // 3. ACTIONS: Log In

  async function login(username: string, password: string) {

    const res = await fetch('https://dummyjson.com/auth/login', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ username, password, expiresInMins: 60 }),

    })



    if (!res.ok) throw new Error('Invalid credentials')



    const data = await res.json()



    // Save to State

    token.value = data.token

    user.value = data



    // Save to Local Storage (Persistence)

    localStorage.setItem('token', data.token)

    localStorage.setItem('user', JSON.stringify(data))

  }



  // 4. ACTIONS: Log Out

  function logout() {

    token.value = ''

    user.value = null

    localStorage.removeItem('token')

    localStorage.removeItem('user')

  }



  return { token, user, isAuthenticated, login, logout }

})
