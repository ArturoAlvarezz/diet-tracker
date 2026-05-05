<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card-glow rounded-lg p-4 sm:p-5">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-cyber-cyan">▸</span>
        <h2 class="text-sm font-semibold tracking-widest text-cyber-purple-light uppercase">Tracker // Comidas</h2>
      </div>

      <!-- Date nav -->
      <div class="flex items-center justify-between gap-2 mb-4">
        <button @click="store.goToPrevDay()" class="text-cyber-cyan hover:text-cyber-cyan-light transition-colors px-2 py-1 text-sm">◀</button>
        <div class="text-sm font-semibold tracking-wider terminal-text">
          <span class="text-cyber-purple">[</span>
          {{ store.selectedDateLabel }}
          <span class="text-cyber-purple">]</span>
        </div>
        <button @click="store.goToNextDay()" class="transition-colors px-2 py-1 text-sm" :class="store.isToday ? 'text-cyber-text-muted/30 cursor-default' : 'text-cyber-cyan hover:text-cyber-cyan-light'" :disabled="store.isToday">▶</button>
      </div>

      <!-- Summary row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        <div v-for="(data, key) in store.progress" :key="key" class="text-center bg-cyber-bg/40 rounded p-2 sm:p-3 border border-cyber-purple/10">
          <div class="text-xl sm:text-2xl font-bold terminal-text" :class="data.current > data.max ? 'text-red-400' : keyColor(key)">{{ data.current }}</div>
          <div class="text-xs text-cyber-text-muted">{{ labelMap[key] }}</div>
          <div class="text-xs" :class="data.current > data.max ? 'text-red-400' : data.current >= data.min ? 'text-green-400' : 'text-cyber-text-muted'">
            / {{ data.goal }} {{ key === 'cal' ? 'kcal' : 'g' }}
          </div>
        </div>
      </div>

      <!-- Add food -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row gap-2 mb-3">
          <select v-model="selectedFood" class="flex-1 bg-cyber-bg border border-cyber-purple/20 rounded px-3 py-2 text-sm text-cyber-text focus:border-cyber-cyan/40 focus:outline-none transition-colors min-w-0">
            <option value="" disabled>Seleccionar comida...</option>
            <option v-for="food in store.customFoods" :key="food.id" :value="food.id">
              {{ food.name }} — {{ food.macros.cal }}kcal
            </option>
          </select>
          <div class="flex items-center gap-1 bg-cyber-bg border border-cyber-purple/20 rounded px-3 shrink-0">
            <button @click="servings = Math.max(0.5, servings - 0.5)" class="text-cyber-text-muted hover:text-cyber-cyan">−</button>
            <input v-model.number="servings" type="number" min="0.5" step="0.5" class="w-12 bg-transparent text-center text-sm text-cyber-text focus:outline-none" />
            <button @click="servings += 0.5" class="text-cyber-text-muted hover:text-cyber-cyan">+</button>
          </div>
          <button
            @click="addSelected"
            :disabled="!selectedFood"
            class="px-5 py-2 rounded text-sm font-semibold tracking-wider transition-all shrink-0"
            :class="selectedFood
              ? 'bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20'
              : 'bg-cyber-bg border border-cyber-purple/10 text-cyber-text-muted cursor-not-allowed'"
          >
            + ADD
          </button>
        </div>
        <div v-if="store.customFoods.length === 0" class="text-xs text-cyber-text-muted">
          <router-link to="/catalog" class="text-cyber-cyan hover:underline">→ Agrega productos al catálogo primero</router-link>
        </div>
      </div>

      <!-- Meal log — mobile: cards, desktop: table -->
      <div v-if="store.todayMeals.length">
        <!-- Mobile card layout -->
        <div class="sm:hidden space-y-2">
          <div
            v-for="meal in store.todayMeals"
            :key="meal.id"
            class="bg-cyber-bg/40 rounded p-3 border border-cyber-purple/10"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-cyber-text-muted">{{ meal.time }}</span>
              <button @click="store.removeMeal(meal.id)" class="text-red-400/50 hover:text-red-400 text-xs transition-colors">✕</button>
            </div>
            <div class="text-sm text-cyber-text font-medium">{{ store.getFood(meal.foodId)?.name || '—' }} <span class="text-cyber-cyan text-xs">×{{ meal.servings }}</span></div>
            <div class="flex gap-3 mt-1 text-xs">
              <span class="text-cyber-purple-light">{{ (store.getFood(meal.foodId)?.macros.cal || 0) * meal.servings }} kcal</span>
              <span class="text-cyber-cyan">P {{ ((store.getFood(meal.foodId)?.macros.protein || 0) * meal.servings).toFixed(1) }}g</span>
              <span class="text-cyber-text-muted">C {{ ((store.getFood(meal.foodId)?.macros.carbs || 0) * meal.servings).toFixed(1) }}g</span>
              <span :class="((store.getFood(meal.foodId)?.macros.fat || 0) * meal.servings) > 5 ? 'text-red-400' : 'text-green-400'">G {{ ((store.getFood(meal.foodId)?.macros.fat || 0) * meal.servings).toFixed(1) }}g</span>
            </div>
          </div>
        </div>

        <!-- Desktop table layout -->
        <div class="hidden sm:block space-y-2">
          <div class="grid grid-cols-12 gap-2 text-xs text-cyber-text-muted px-3 mb-1">
            <div class="col-span-1">TIME</div>
            <div class="col-span-4">COMIDA</div>
            <div class="col-span-1 text-center">SERV</div>
            <div class="col-span-1 text-center">CAL</div>
            <div class="col-span-1 text-center">PROT</div>
            <div class="col-span-1 text-center">CARB</div>
            <div class="col-span-1 text-center">GRASA</div>
            <div class="col-span-2"></div>
          </div>
          <div
            v-for="meal in store.todayMeals"
            :key="meal.id + '-dt'"
            class="grid grid-cols-12 gap-2 items-center bg-cyber-bg/40 rounded px-3 py-2 border border-cyber-purple/10 text-sm"
          >
            <div class="col-span-1 text-xs text-cyber-text-muted">{{ meal.time }}</div>
            <div class="col-span-4 text-cyber-text truncate">{{ store.getFood(meal.foodId)?.name || '—' }}</div>
            <div class="col-span-1 text-center text-cyber-cyan">{{ meal.servings }}×</div>
            <div class="col-span-1 text-center text-cyber-purple-light">{{ (store.getFood(meal.foodId)?.macros.cal || 0) * meal.servings }}</div>
            <div class="col-span-1 text-center text-cyber-cyan">{{ ((store.getFood(meal.foodId)?.macros.protein || 0) * meal.servings).toFixed(1) }}</div>
            <div class="col-span-1 text-center text-cyber-text-muted">{{ ((store.getFood(meal.foodId)?.macros.carbs || 0) * meal.servings).toFixed(1) }}</div>
            <div class="col-span-1 text-center" :class="((store.getFood(meal.foodId)?.macros.fat || 0) * meal.servings) > 5 ? 'text-red-400' : 'text-green-400'">{{ ((store.getFood(meal.foodId)?.macros.fat || 0) * meal.servings).toFixed(1) }}</div>
            <div class="col-span-2 text-right">
              <button @click="store.removeMeal(meal.id)" class="text-red-400/50 hover:text-red-400 text-xs transition-colors">✕ REMOVER</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-cyber-text-muted py-8 text-sm">
        <span class="text-cyber-purple">[</span> Sin comidas registradas <span class="text-cyber-purple">]</span>
      </div>

      <div v-if="store.todayMeals.length" class="mt-4 text-right">
        <button @click="store.clearDay()" class="text-xs text-red-400/60 hover:text-red-400 transition-colors tracking-wider">LIMPIAR DÍA</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDietStore } from '../utils/store.js'

const store = useDietStore()
const selectedFood = ref('')
const servings = ref(1)

const labelMap = { cal: 'Calorías', protein: 'Proteína', carbs: 'Carbohidratos', fat: 'Grasa' }

function keyColor(key) {
  const map = { cal: 'text-cyber-purple-light', protein: 'text-cyber-cyan', carbs: 'text-cyber-purple', fat: 'text-green-400' }
  return map[key] || 'text-cyber-text'
}

function addSelected() {
  if (selectedFood.value) {
    store.addMeal(selectedFood.value, servings.value)
    selectedFood.value = ''
    servings.value = 1
  }
}
</script>
