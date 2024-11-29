import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@wagmi/vue/nuxt', '@nuxtjs/tailwindcss'],
  compatibilityDate: '2024-11-29',
  pages: true,
  runtimeConfig: {
    public: {
      '@nuxtjs/tailwindcss': {
        cssPath: '~/assets/css/tailwind.css',
        configPath: 'tailwind.config.ts',
        exposeConfig: false,
        injectPosition: 0,
        viewer: true,
      }
    }
  }
})
