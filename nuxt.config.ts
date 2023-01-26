import { setAbsoluteSqliteDatabaseUrlForPrisma } from './prisma/utils'

setAbsoluteSqliteDatabaseUrlForPrisma()

export default defineNuxtConfig({
  runtimeConfig: {
    version: '0.0.1'
  },
  modules: ['@sidebase/nuxt-auth', '@nuxtjs/tailwindcss', 'nuxt-svgo', '@huntersofbook/naive-ui-nuxt'],
  extends: ['@sidebase/core'],
  typescript: {
    shim: false
  }
})
