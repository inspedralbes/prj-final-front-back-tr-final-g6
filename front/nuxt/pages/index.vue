<template>
  <div
    class="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-12"
  >
    <div
      class="w-full max-w-4xl bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700"
    >
      <div class="bg-gradient-to-r from-teal-800 to-blue-900 p-8 md:p-12 text-center">
        <div class="flex flex-col items-center mb-6">
          <div
            class="w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-white tracking-tight">
            ACOUBOX
          </h1>
          <p class="mt-2 text-teal-200 font-medium">
            Institut Pedralbes • Monitorització d'Aules
          </p>
        </div>
      </div>

      <!-- Content Section -->
      <div class="p-8 md:p-12">
        <div class="max-w-2xl mx-auto text-center">
          <!-- Description -->
          <p class="text-lg text-slate-300 leading-relaxed mb-8">
            Benvinguts a <span class="font-semibold text-teal-400">ACOUBOX</span>, una
            plataforma desenvolupada pels estudiants de
            <span class="font-semibold">CFGS DAM</span> i
            <span class="font-semibold">PFI</span> de l'<span class="font-semibold"
              >Institut Pedralbes</span
            >. Visualitzeu en temps real les dades de temperatura i ocupació de les aules
            per a una millor gestió dels espais.
          </p>

          <!-- Features Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div
              class="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-teal-400 transition-colors"
            >
              <div class="text-teal-400 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                </svg>
              </div>
              <h3 class="font-semibold text-white mb-1">Dades en Temps Real</h3>
              <p class="text-sm text-slate-400">Monitorització contínua de les aules</p>
            </div>

            <div
              class="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-teal-400 transition-colors"
            >
              <div class="text-teal-400 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6zm2.25 0h.008v.008H9.75V6z"
                  />
                </svg>
              </div>
              <h3 class="font-semibold text-white mb-1">Gràfics Interactius</h3>
              <p class="text-sm text-slate-400">Visualització clara de les dades</p>
            </div>

            <div
              class="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-teal-400 transition-colors"
            >
              <div class="text-teal-400 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
              </div>
              <h3 class="font-semibold text-white mb-1">Alertes Inteligents</h3>
              <p class="text-sm text-slate-400">Notificacions de valors anòmals</p>
            </div>
          </div>

          <!-- Login Button -->
          <div class="mt-6">
            <nuxt-link to="/login" aria-label="Anar a la pàgina d'inici de sessió">
              <Button
                label="Inicia Sessió"
                icon="pi pi-sign-in"
                class="bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-800"
              />
            </nuxt-link>
          </div>

          <!-- Footer Note -->
          <p class="mt-8 text-sm text-slate-500">
            Projecte desenvolupat pels estudiants de DAM i PFI • Institut Pedralbes
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "tailwindcss/tailwind.css";
import Button from "primevue/button";
import "primevue/resources/themes/vela-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
</script>

<style scoped>
/* Smooth transitions for interactive elements */
button,
a {
  transition: all 0.3s ease;
}

/* Gradient animation for the header */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 10s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
