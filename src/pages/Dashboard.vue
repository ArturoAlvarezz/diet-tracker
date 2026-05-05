<template>
  <div class="space-y-6">
    <!-- Date navigator -->
    <div class="card-glow rounded-lg p-4 sm:p-5">
      <div class="flex items-center justify-between gap-2">
        <button @click="store.goToPrevDay()" class="text-cyber-cyan hover:text-cyber-cyan-light transition-colors px-2 py-1">◀</button>
        <div class="text-center">
          <div class="text-sm sm:text-base font-semibold tracking-wider terminal-text">
            <span class="text-cyber-purple">[</span>
            {{ store.selectedDateLabel }}
            <span class="text-cyber-purple">]</span>
          </div>
          <div v-if="!store.isToday" class="text-xs text-cyber-text-muted mt-0.5">
            <button @click="store.goToToday()" class="text-cyber-cyan hover:underline">→ Ir a hoy</button>
          </div>
        </div>
        <button @click="store.goToNextDay()" class="transition-colors px-2 py-1" :class="store.isToday ? 'text-cyber-text-muted/30 cursor-default' : 'text-cyber-cyan hover:text-cyber-cyan-light'" :disabled="store.isToday">▶</button>
      </div>
    </div>

    <!-- Macro progress bars -->
    <div class="card-glow rounded-lg p-4 sm:p-5">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-cyber-cyan">▸</span>
        <h2 class="text-sm font-semibold tracking-widest text-cyber-purple-light uppercase">Sistema // Estado</h2>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MacroBar
          v-for="(data, key) in store.progress"
          :key="key"
          :label="labels[key]"
          :current="data.current"
          :goal="data.goal"
          :min="data.min"
          :max="data.max"
          :pct="data.pct"
          :unit="key === 'cal' ? 'kcal' : 'g'"
          :color="colors[key]"
        />
      </div>
    </div>

    <!-- Macro percentages -->
    <div class="card-glow rounded-lg p-4 sm:p-5">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-cyber-cyan">▸</span>
        <h2 class="text-sm font-semibold tracking-widest text-cyber-purple-light uppercase">Distribución // Macros</h2>
      </div>
      <div class="flex flex-wrap gap-4 sm:gap-6 items-center justify-center">
        <div class="text-center">
          <div class="text-2xl sm:text-3xl font-bold text-cyber-cyan terminal-text">{{ store.macroPercentages.protein }}<span class="text-lg">%</span></div>
          <div class="text-xs text-cyber-text-muted mt-1">PROTEÍNA</div>
        </div>
        <div class="text-cyber-purple text-xl sm:text-2xl">│</div>
        <div class="text-center">
          <div class="text-2xl sm:text-3xl font-bold text-cyber-purple-light terminal-text">{{ store.macroPercentages.carbs }}<span class="text-lg">%</span></div>
          <div class="text-xs text-cyber-text-muted mt-1">CARBOHIDRATOS</div>
        </div>
        <div class="text-cyber-purple text-xl sm:text-2xl">│</div>
        <div class="text-center">
          <div class="text-2xl sm:text-3xl font-bold" :class="store.macroPercentages.fat > 20 ? 'text-red-400' : 'text-green-400'">{{ store.macroPercentages.fat }}<span class="text-lg">%</span></div>
          <div class="text-xs text-cyber-text-muted mt-1">GRASA</div>
        </div>
      </div>

      <div class="mt-4 h-3 rounded-full overflow-hidden flex bg-cyber-bg">
        <div class="bg-cyber-cyan transition-all" :style="{ width: store.macroPercentages.protein + '%' }"></div>
        <div class="bg-cyber-purple-light transition-all" :style="{ width: store.macroPercentages.carbs + '%' }"></div>
        <div class="bg-green-400 transition-all" :style="{ width: store.macroPercentages.fat + '%' }"></div>
      </div>
      <div class="text-xs text-cyber-text-muted mt-1">Objetivo: P 25-30% │ C 50-55% │ G 15-20%</div>
    </div>

    <!-- Today's log -->
    <div class="card-glow rounded-lg p-4 sm:p-5" v-if="store.todayMeals.length">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-cyber-cyan">▸</span>
        <h2 class="text-sm font-semibold tracking-widest text-cyber-purple-light uppercase">Log // {{ store.isToday ? 'Hoy' : store.selectedDateLabel }}</h2>
        <button @click="store.clearDay()" class="ml-auto text-xs text-red-400 hover:text-red-300 transition-colors">LIMPIAR</button>
      </div>
      <div class="space-y-2">
        <div
          v-for="meal in store.todayMeals"
          :key="meal.id"
          class="flex items-center justify-between bg-cyber-bg/40 rounded px-2 sm:px-3 py-2 border border-cyber-purple/10 gap-2 min-w-0"
        >
          <div class="min-w-0 truncate">
            <span class="text-cyber-text-muted text-xs mr-2 shrink-0">{{ meal.time }}</span>
            <span class="text-sm">{{ store.getFood(meal.foodId)?.name || '—' }}</span>
            <span v-if="meal.servings > 1" class="text-xs text-cyber-cyan ml-1">×{{ meal.servings }}</span>
          </div>
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <span class="text-xs text-cyber-text-muted">{{ store.getFood(meal.foodId)?.macros.cal * meal.servings || 0 }}kcal</span>
            <button @click="store.removeMeal(meal.id)" class="text-red-400/60 hover:text-red-400 text-xs">✕</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card-glow rounded-lg p-4 sm:p-5 text-center text-cyber-text-muted py-8 text-sm">
      <span class="text-cyber-purple">[</span> Sin comidas registradas <span class="text-cyber-purple">]</span>
      <div class="mt-2">
        <router-link to="/catalog" class="text-cyber-cyan hover:underline text-xs">→ Agregar comida desde Catálogo</router-link>
      </div>
    </div>

    <!-- Comparison table -->
    <div class="card-glow rounded-lg p-4 sm:p-5">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-cyber-cyan">▸</span>
        <h2 class="text-sm font-semibold tracking-widest text-cyber-purple-light uppercase">Comparador // vs Objetivos</h2>
      </div>
      <div class="overflow-x-auto -mx-1">
        <table class="w-full text-sm min-w-[400px]">
          <thead>
            <tr class="text-xs text-cyber-text-muted border-b border-cyber-purple/20">
              <th class="text-left py-2 px-1">MACRO</th>
              <th class="text-center py-2 px-1">ACTUAL</th>
              <th class="text-center py-2 px-1">MÍN</th>
              <th class="text-center py-2 px-1">OBJETIVO</th>
              <th class="text-center py-2 px-1">MÁX</th>
              <th class="text-center py-2 px-1">ESTADO</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, key) in store.progress" :key="key" class="border-b border-cyber-purple/5">
              <td class="py-2 px-1 font-semibold" :class="keyColor(key)">{{ labelMap[key] }}</td>
              <td class="text-center py-2 px-1 text-cyber-text">{{ data.current }} {{ key === 'cal' ? 'kcal' : 'g' }}</td>
              <td class="text-center py-2 px-1 text-cyber-text-muted">{{ data.min }}</td>
              <td class="text-center py-2 px-1 text-cyber-cyan">{{ data.goal }}</td>
              <td class="text-center py-2 px-1 text-cyber-text-muted">{{ data.max }}</td>
              <td class="text-center py-2 px-1">
                <span v-if="data.current > data.max" class="text-red-400 text-xs">▲ EXCEDIDO</span>
                <span v-else-if="data.current >= data.min" class="text-green-400 text-xs">✓ OK</span>
                <span v-else class="text-yellow-400 text-xs">▼ BAJO</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDietStore } from '../utils/store.js'
import MacroBar from '../components/MacroBar.vue'

const store = useDietStore()

const labels = { cal: 'CALORÍAS', protein: 'PROTEÍNA', carbs: 'CARBOHIDRATOS', fat: 'GRASA' }
const colors = { cal: 'cyber-purple-light', protein: 'cyber-cyan', carbs: 'cyber-purple-light', fat: 'green-400' }
const labelMap = { cal: 'Calorías', protein: 'Proteína', carbs: 'Carbohidratos', fat: 'Grasa' }

function keyColor(key) {
  const map = { cal: 'text-cyber-purple-light', protein: 'text-cyber-cyan', carbs: 'text-cyber-purple', fat: 'text-green-400' }
  return map[key] || 'text-cyber-text'
}
</script>
