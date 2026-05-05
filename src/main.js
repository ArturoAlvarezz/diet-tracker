import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Dashboard from './pages/Dashboard.vue'
import Catalog from './pages/Catalog.vue'
import MealTracker from './pages/MealTracker.vue'
import './style.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/catalog', component: Catalog },
    { path: '/tracker', component: MealTracker },
  ],
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
