<template>
  <div class="card-glow rounded-lg p-3 sm:p-4 relative z-10 min-w-0">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-semibold tracking-widest truncate" :class="textColorClass">{{ label }}</span>
      <span class="text-xs text-cyber-text-muted whitespace-nowrap ml-1">{{ current }}/{{ goal }} {{ unit }}</span>
    </div>
    <div class="h-2 bg-cyber-bg rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500 progress-glow"
        :class="barColorClass"
        :style="{ width: pct + '%' }"
      ></div>
    </div>
    <div class="flex justify-between mt-1 text-xs text-cyber-text-muted">
      <span>{{ min }}</span>
      <span :class="statusClass">{{ statusText }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  current: Number,
  goal: Number,
  min: Number,
  max: Number,
  pct: Number,
  unit: String,
  color: String,
})

const textColorClass = computed(() => {
  const map = { 'cyber-cyan': 'text-cyber-cyan', 'cyber-purple-light': 'text-cyber-purple-light', 'green-400': 'text-green-400' }
  return map[props.color] || 'text-cyber-text'
})

const barColorClass = computed(() => {
  const map = { 'cyber-cyan': 'bg-cyber-cyan', 'cyber-purple-light': 'bg-cyber-purple-light', 'green-400': 'bg-green-400' }
  if (props.current > props.max) return 'bg-red-400'
  return map[props.color] || 'bg-cyber-purple'
})

const statusClass = computed(() => {
  if (props.current > props.max) return 'text-red-400'
  if (props.current >= props.min) return 'text-green-400'
  return 'text-cyber-text-muted'
})

const statusText = computed(() => {
  if (props.current > props.max) return 'EXCEDIDO'
  if (props.current >= props.min) return 'OK'
  return 'BAJO'
})
</script>
