<script setup lang="ts">
import { useAccount, useBalance } from '@wagmi/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { address, chainId, status } = useAccount()
const { data: balance } = useBalance({
  address,
})

// Redirect if not connected
if (status.value === 'disconnected') {
  navigateTo('/')
}

const shortenAddress = (addr: string) => {
  if (!addr) return ''
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
  // You might want to add a toast notification here
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50">
      <h2 class="text-2xl font-bold text-gray-100 mb-6">Account Details</h2>
      
      <div class="space-y-6">
        <!-- Address -->
        <div class="space-y-2">
          <label class="text-sm text-gray-400">Address</label>
          <div class="flex items-center space-x-2">
            <code class="flex-1 block p-3 bg-gray-900/50 rounded-lg font-mono text-gray-200">
              {{ address }}
            </code>
            <button 
              @click="copyToClipboard(address!)"
              class="p-2 text-gray-400 hover:text-gray-200 transition-colors"
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Chain -->
        <div class="space-y-2">
          <label class="text-sm text-gray-400">Network</label>
          <div class="p-3 bg-gray-900/50 rounded-lg font-mono text-gray-200">
            Chain ID: {{ chainId }}
          </div>
        </div>

        <!-- Balance -->
        <div class="space-y-2">
          <label class="text-sm text-gray-400">Balance</label>
          <div class="p-3 bg-gray-900/50 rounded-lg font-mono text-gray-200">
            {{ balance?.formatted || '0' }} {{ balance?.symbol }}
          </div>
        </div>
      </div>

      <!-- Back button -->
      <div class="mt-8">
        <button
          @click="router.push('/')"
          class="flex items-center text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  </div>
</template>
