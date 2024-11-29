<script setup lang="ts">
import { useChainId, useConnect } from '@wagmi/vue'

const chainId = useChainId()
const { connect, connectors, error, status } = useConnect()
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-200">Connect Wallet</h2>

    <div class="grid gap-3">
      <button
        v-for="connector in connectors"
        :key="connector.id"
        type="button"
        @click="connect({ connector, chainId })"
        class="flex items-center justify-center px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
      >
        {{ connector.name }}
      </button>
    </div>

    <div v-if="error || status !== 'disconnected'" class="mt-4 p-4 rounded-lg bg-gray-700/50">
      <p v-if="error" class="text-red-400 text-sm">{{ error.message }}</p>
      <p v-else class="text-gray-400 text-sm">Status: {{ status }}</p>
    </div>
  </div>
</template>
