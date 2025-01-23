// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
  ],
  css: [
    "primevue/resources/primevue.min.css", // Estilos básicos de PrimeVue
    "primeicons/primeicons.css", // Iconos de PrimeVue
    "tailwindcss/tailwind.css" // TailwindCSS
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  }
});
