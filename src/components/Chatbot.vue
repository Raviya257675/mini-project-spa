<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { GoogleGenerativeAI } from '@google/generative-ai'

// --- UI State ---
const isOpen = ref(false) // Controls if the chat window is visible

// --- AI State ---
const prompt = ref('')
const messages = ref<{ role: string; text: string }[]>([])
const isLoading = ref(false)

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY)

// --- Auto-Scroll Logic ---
const chatContainer = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!prompt.value.trim()) return

  messages.value.push({ role: 'user', text: prompt.value })
  const currentPrompt = prompt.value
  prompt.value = ''
  isLoading.value = true

  // 1. Scroll down immediately after the user sends a message
  await nextTick()
  scrollToBottom()

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(currentPrompt)
    const response = await result.response
    messages.value.push({ role: 'bot', text: response.text() })

    // 2. Scroll down again after the AI finishes typing its reply
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('The actual error is:', error)
    messages.value.push({ role: 'bot', text: 'Oops! Something went wrong.' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
    <Transition name="slide-up">
      <div
        v-if="isOpen"
        class="mb-4 w-[300px] sm:w-[340px] h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
      >
        <div class="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md z-10">
          <div class="flex items-center gap-2">
            <span class="font-bold tracking-wide">Aura AIbot</span>
          </div>
          <button
            @click="isOpen = false"
            class="hover:bg-blue-700 p-1 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div ref="chatContainer" class="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
          <div v-if="messages.length === 0" class="text-center text-gray-400 text-sm mt-4">
            How can I help you style your wardrobe today?
          </div>

          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="msg.role === 'user' ? 'text-right' : 'text-left'"
          >
            <span
              :class="
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-200 text-gray-800 rounded-bl-sm'
              "
              class="inline-block px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm text-left"
            >
              {{ msg.text }}
            </span>
          </div>

          <div v-if="isLoading" class="text-left">
            <span
              class="inline-block px-4 py-2.5 bg-gray-200 text-gray-500 rounded-2xl rounded-bl-sm text-sm italic animate-pulse"
            >
              Typing...
            </span>
          </div>
        </div>

        <div class="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
          <input
            v-model="prompt"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Ask about our collection..."
            class="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
          />
          <button
            @click="sendMessage"
            :disabled="isLoading"
            class="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transform rotate-90"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <button
      @click="isOpen = !isOpen"
      class="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all duration-300"
    >
      <svg
        v-if="!isOpen"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
