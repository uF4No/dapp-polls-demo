<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
// Ensure consistent styling between server and client
useHead({
  bodyAttrs: {
    class: 'bg-gray-900'
  }
})
</script>

<style>
body {
  @apply antialiased;
}
</style>
