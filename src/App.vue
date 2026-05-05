<template>
  <div class="min-h-screen relative scanline-overlay overflow-x-hidden">
    <!-- Header -->
    <header class="border-b border-glow bg-cyber-bg-alt/80 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
          <span class="text-cyber-purple text-xl shrink-0">▍</span>
          <h1 class="text-base sm:text-lg font-bold tracking-wider terminal-text truncate">
            DIET<span class="text-cyber-cyan">://</span>TRACKER
          </h1>
          <span class="text-xs text-cyber-text-muted animate-cursor-blink ml-1 shrink-0">v1.0</span>
        </div>
        <nav class="flex gap-1 text-xs sm:text-sm overflow-x-auto shrink-0">
          <router-link to="/" class="nav-link" active-class="nav-active">
            <span class="text-cyber-cyan mr-1">></span>Dashboard
          </router-link>
          <router-link to="/catalog" class="nav-link" active-class="nav-active">
            <span class="text-cyber-cyan mr-1">></span>Catálogo
          </router-link>
          <router-link to="/tracker" class="nav-link" active-class="nav-active">
            <span class="text-cyber-cyan mr-1">></span>Tracker
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 relative z-10 w-full overflow-x-hidden">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="border-t border-glow py-3 text-center text-xs text-cyber-text-muted">
      <span class="text-cyber-purple">━━</span> SISTEMA ACTIVO <span class="text-cyber-purple">━━</span>
    </footer>
  </div>
</template>

<style scoped>
.nav-link {
  @apply px-2 sm:px-3 py-1.5 rounded text-cyber-text-muted hover:text-cyber-text transition-colors whitespace-nowrap;
}
.nav-active {
  @apply text-cyber-cyan bg-cyber-purple/10 border border-cyber-purple/30;
}
</style>
