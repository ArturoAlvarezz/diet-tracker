<template>
  <div class="space-y-6">
    <!-- Add product form -->
    <div class="card-glow rounded-lg p-4 sm:p-5">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-cyber-cyan">▸</span>
        <h2 class="text-sm font-semibold tracking-widest text-cyber-purple-light uppercase">Catálogo // Agregar Producto</h2>
      </div>

      <form @submit.prevent="submitFood" class="space-y-4">
        <!-- Nombre -->
        <div>
          <label class="text-xs text-cyber-text-muted tracking-wider block mb-1">NOMBRE</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Ej: Atún en agua Robinson Crusoe"
            class="w-full bg-cyber-bg border border-cyber-purple/20 rounded px-3 py-2 text-sm text-cyber-text placeholder-cyber-text-muted/40 focus:border-cyber-cyan/40 focus:outline-none transition-colors"
          />
        </div>

        <!-- Macros row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label class="text-xs text-cyber-text-muted tracking-wider block mb-1">CALORÍAS</label>
            <input
              v-model.number="form.cal"
              type="number"
              required
              min="0"
              placeholder="kcal"
              class="w-full bg-cyber-bg border border-cyber-purple/20 rounded px-3 py-2 text-sm text-cyber-text placeholder-cyber-text-muted/40 focus:border-cyber-cyan/40 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label class="text-xs text-cyber-cyan tracking-wider block mb-1">PROTEÍNA (g)</label>
            <input
              v-model.number="form.protein"
              type="number"
              required
              min="0"
              step="0.1"
              placeholder="g"
              class="w-full bg-cyber-bg border border-cyber-purple/20 rounded px-3 py-2 text-sm text-cyber-text placeholder-cyber-text-muted/40 focus:border-cyber-cyan/40 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label class="text-xs text-cyber-purple-light tracking-wider block mb-1">CARBOHIDRATOS (g)</label>
            <input
              v-model.number="form.carbs"
              type="number"
              required
              min="0"
              step="0.1"
              placeholder="g"
              class="w-full bg-cyber-bg border border-cyber-purple/20 rounded px-3 py-2 text-sm text-cyber-text placeholder-cyber-text-muted/40 focus:border-cyber-cyan/40 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label class="text-xs text-green-400 tracking-wider block mb-1">GRASA (g)</label>
            <input
              v-model.number="form.fat"
              type="number"
              required
              min="0"
              step="0.1"
              placeholder="g"
              class="w-full bg-cyber-bg border border-cyber-purple/20 rounded px-3 py-2 text-sm text-cyber-text placeholder-cyber-text-muted/40 focus:border-cyber-cyan/40 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <!-- Gramos + URL -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-cyber-text-muted tracking-wider block mb-1">GRAMOS POR PORCIÓN</label>
            <input
              v-model.number="form.grams"
              type="number"
              min="1"
              placeholder="Ej: 140"
              class="w-full bg-cyber-bg border border-cyber-purple/20 rounded px-3 py-2 text-sm text-cyber-text placeholder-cyber-text-muted/40 focus:border-cyber-cyan/40 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label class="text-xs text-cyber-text-muted tracking-wider block mb-1">LINK DE COMPRA (URL)</label>
            <input
              v-model="form.url"
              type="url"
              placeholder="https://www.jumbo.cl/..."
              class="w-full bg-cyber-bg border border-cyber-purple/20 rounded px-3 py-2 text-sm text-cyber-text placeholder-cyber-text-muted/40 focus:border-cyber-cyan/40 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="!form.name || !form.cal"
          class="px-6 py-2 rounded text-sm font-semibold tracking-wider transition-all"
          :class="form.name && form.cal
            ? 'bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20'
            : 'bg-cyber-bg border border-cyber-purple/10 text-cyber-text-muted cursor-not-allowed'"
        >
          + AGREGAR PRODUCTO
        </button>
      </form>
    </div>

    <!-- Existing products -->
    <div class="card-glow rounded-lg p-4 sm:p-5">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-cyber-cyan">▸</span>
        <h2 class="text-sm font-semibold tracking-widest text-cyber-purple-light uppercase">Catálogo // Productos ({{ store.customFoods.length }})</h2>
      </div>

      <div v-if="store.customFoods.length === 0" class="text-center text-cyber-text-muted py-8 text-sm">
        <span class="text-cyber-purple">[</span> Sin productos. Agrega el primero arriba <span class="text-cyber-purple">]</span>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="food in store.customFoods"
          :key="food.id"
          class="bg-cyber-bg/60 rounded-lg p-3 sm:p-4 border border-cyber-purple/15 min-w-0 transition-all hover:shadow-glow-purple-sm"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-2 gap-2">
            <div class="text-sm font-semibold text-cyber-text truncate">{{ food.name }}</div>
          </div>

          <!-- Macros -->
          <div class="grid grid-cols-4 gap-1 sm:gap-2 text-xs mb-3">
            <div class="text-center">
              <div class="text-cyber-purple-light font-bold">{{ food.macros.cal }}</div>
              <div class="text-cyber-text-muted">kcal</div>
            </div>
            <div class="text-center">
              <div class="text-cyber-cyan font-bold">{{ food.macros.protein }}g</div>
              <div class="text-cyber-text-muted">Prot</div>
            </div>
            <div class="text-center">
              <div class="text-cyber-purple font-bold">{{ food.macros.carbs }}g</div>
              <div class="text-cyber-text-muted">Carb</div>
            </div>
            <div class="text-center">
              <div class="font-bold" :class="food.macros.fat > 5 ? 'text-red-400' : 'text-green-400'">{{ food.macros.fat }}g</div>
              <div class="text-cyber-text-muted">Grasa</div>
            </div>
          </div>

          <div class="text-xs text-cyber-text-muted mb-2">Porción: {{ food.per }}{{ food.unit }}</div>

          <!-- URL -->
          <div v-if="food.url" class="border-t border-cyber-purple/10 pt-2 mt-2">
            <a :href="food.url" target="_blank" class="text-xs text-cyber-cyan hover:underline truncate block">🛒 Ver producto →</a>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 mt-3">
            <button
              @click="store.addMeal(food.id)"
              class="flex-1 py-1.5 rounded text-xs font-semibold tracking-wider transition-all bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20"
            >
              + AGREGAR AL TRACKER
            </button>
            <button
              @click="store.removeCustomFood(food.id)"
              class="py-1.5 px-3 rounded text-xs transition-all bg-red-400/5 border border-red-400/20 text-red-400/60 hover:text-red-400 hover:bg-red-400/10"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useDietStore } from '../utils/store.js'

const store = useDietStore()

const form = reactive({
  name: '',
  cal: null,
  protein: null,
  carbs: null,
  fat: null,
  grams: 100,
  url: '',
})

function submitFood() {
  if (!form.name || !form.cal) return
  store.addCustomFood({ ...form })
  // Reset
  form.name = ''
  form.cal = null
  form.protein = null
  form.carbs = null
  form.fat = null
  form.grams = 100
  form.url = ''
}
</script>
