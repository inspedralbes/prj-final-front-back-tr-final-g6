import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: [
    "primevue/resources/primevue.min.css",
    "primeicons/primeicons.css",
    "tailwindcss/tailwind.css"
  ],
  runtimeConfig: {
    public: {
      URL: process.env.NUXT_PUBLIC_URL || 'http://localhost:3020',
      URL_PROD: process.env.NUXT_PUBLIC_URL_PROD || 'http://dev.acubox.cat:3020'
    }
  },
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },
  app: {
    head: {
      title: 'Acubox',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
});