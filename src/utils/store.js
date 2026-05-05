import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_PREFIX = 'diet-log-'
const CUSTOM_FOODS_KEY = 'diet-custom-foods'

function dateKey(date) {
  return date.toISOString().slice(0, 10)
}

function loadMealsForDate(d) {
  try {
    const key = STORAGE_PREFIX + dateKey(d)
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch { return [] }
}

function saveMealsForDate(d, meals) {
  const key = STORAGE_PREFIX + dateKey(d)
  localStorage.setItem(key, JSON.stringify(meals))
}

function loadCustomFoods() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_FOODS_KEY) || '[]')
  } catch { return [] }
}

function saveCustomFoods(foods) {
  localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(foods))
}

export const useDietStore = defineStore('diet', () => {
  // Current selected date
  const selectedDate = ref(new Date())

  // Custom foods catalog
  const customFoods = ref(loadCustomFoods())

  // Today's meals (reactive, reloads when date changes)
  const todayMeals = ref(loadMealsForDate(selectedDate.value))

  // Watch date changes
  watch(selectedDate, (newDate) => {
    todayMeals.value = loadMealsForDate(newDate)
  })

  function addCustomFood(food) {
    const newFood = {
      id: 'custom-' + Date.now(),
      name: food.name,
      per: food.grams || 100,
      unit: 'g',
      macros: {
        cal: Number(food.cal) || 0,
        protein: Number(food.protein) || 0,
        carbs: Number(food.carbs) || 0,
        fat: Number(food.fat) || 0,
      },
      url: food.url || null,
      createdAt: new Date().toISOString(),
    }
    customFoods.value.push(newFood)
    saveCustomFoods(customFoods.value)
    return newFood
  }

  function removeCustomFood(id) {
    customFoods.value = customFoods.value.filter(f => f.id !== id)
    saveCustomFoods(customFoods.value)
  }

  function addMeal(foodId, servings = 1) {
    todayMeals.value.push({
      id: Date.now(),
      foodId,
      servings,
      time: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
    })
    saveMealsForDate(selectedDate.value, todayMeals.value)
  }

  function removeMeal(id) {
    todayMeals.value = todayMeals.value.filter(m => m.id !== id)
    saveMealsForDate(selectedDate.value, todayMeals.value)
  }

  function clearDay() {
    todayMeals.value = []
    saveMealsForDate(selectedDate.value, todayMeals.value)
  }

  function goToPrevDay() {
    const d = new Date(selectedDate.value)
    d.setDate(d.getDate() - 1)
    selectedDate.value = d
  }

  function goToNextDay() {
    const d = new Date(selectedDate.value)
    d.setDate(d.getDate() + 1)
    if (d <= new Date()) {
      selectedDate.value = d
    }
  }

  function goToToday() {
    selectedDate.value = new Date()
  }

  const isToday = computed(() => {
    return dateKey(selectedDate.value) === dateKey(new Date())
  })

  const todayTotals = computed(() => {
    let cal = 0, protein = 0, carbs = 0, fat = 0
    for (const meal of todayMeals.value) {
      const food = customFoods.value.find(f => f.id === meal.foodId)
      if (!food) continue
      const s = meal.servings
      cal += food.macros.cal * s
      protein += food.macros.protein * s
      carbs += food.macros.carbs * s
      fat += food.macros.fat * s
    }
    return { cal: Math.round(cal), protein: Math.round(protein), carbs: Math.round(carbs), fat: Math.round(fat) }
  })

  const progress = computed(() => {
    const t = targets
    const tot = todayTotals.value
    return {
      cal: { current: tot.cal, goal: t.calories.goal, min: t.calories.min, max: t.calories.max, pct: Math.min(100, (tot.cal / t.calories.goal) * 100) },
      protein: { current: tot.protein, goal: t.protein.goal, min: t.protein.min, max: t.protein.max, pct: Math.min(100, (tot.protein / t.protein.goal) * 100) },
      carbs: { current: tot.carbs, goal: t.carbs.goal, min: t.carbs.min, max: t.carbs.max, pct: Math.min(100, (tot.carbs / t.carbs.goal) * 100) },
      fat: { current: tot.fat, goal: t.fat.goal, min: t.fat.min, max: t.fat.max, pct: Math.min(100, (tot.fat / t.fat.goal) * 100) },
    }
  })

  const macroPercentages = computed(() => {
    const tot = todayTotals.value
    const totalCals = tot.cal || 1
    return {
      protein: Math.round((tot.protein * 4 / totalCals) * 100),
      carbs: Math.round((tot.carbs * 4 / totalCals) * 100),
      fat: Math.round((tot.fat * 9 / totalCals) * 100),
    }
  })

  const selectedDateLabel = computed(() => {
    return selectedDate.value.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })
  })

  function getFood(id) {
    return customFoods.value.find(f => f.id === id)
  }

  return {
    selectedDate, selectedDateLabel, isToday,
    customFoods, addCustomFood, removeCustomFood,
    todayMeals, addMeal, removeMeal, clearDay,
    goToPrevDay, goToNextDay, goToToday,
    todayTotals, progress, macroPercentages,
    getFood,
  }
})

// Need to import targets in store
import { targets } from '../data/foods.js'
