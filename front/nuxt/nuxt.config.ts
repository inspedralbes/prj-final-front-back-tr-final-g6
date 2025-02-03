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
    "primevue/resources/primevue.min.css",
    "primeicons/primeicons.css",
    "tailwindcss/tailwind.css"
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },
  plugins: [
    '~/plugins/socket.js',
  ],
});
