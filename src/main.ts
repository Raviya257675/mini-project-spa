import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css' // (or './main.css' depending on your setup)

const app = createApp(App)

app.use(createPinia()) // This line activates the "Global Brain"
app.use(router)

app.mount('#app')
