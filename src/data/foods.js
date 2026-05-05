// Macros objetivo para Arturo
export const targets = {
  calories: { min: 2500, max: 3200, goal: 3000 },
  protein: { min: 170, max: 190, goal: 180 },   // ~24%
  carbs: { min: 340, max: 400, goal: 370 },       // ~49%
  fat: { min: 55, max: 65, goal: 60 },            // ~18%
}

export const categories = [
  { id: 'custom', label: 'CUSTOM', icon: '🍽️', color: 'purple' },
]

export const tags = {
  'bajo-grasa': { label: '✓ BAJO GRASA', class: 'text-cyber-cyan' },
}
