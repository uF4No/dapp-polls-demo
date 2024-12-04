<script setup lang="ts">
import { useAccount, useBalance } from '@wagmi/vue'
import { useRouter } from 'vue-router'
import { ref, onMounted, computed, watch } from 'vue'
import { getPublicClient } from '@wagmi/core'
import { config } from "@/wagmi"

const router = useRouter()
const { address, chainId, status } = useAccount()
const { data: balance } = useBalance({
  address,
})

const isContract = ref(false)
const isChecking = ref(false)

// Check if address is a contract
const checkIfContract = async () => {
  if (!address.value) return
  
  isChecking.value = true
  try {
    const publicClient = getPublicClient(config)
    const code = await publicClient.getCode({
      address: address.value
    })
    isContract.value = code ? code.length > 2 : false
  } catch (error) {
    console.error('Error checking contract:', error)
  } finally {
    isChecking.value = false
  }
}

const accountType = computed(() => {
  if (!address.value) return ''
  if (isContract.value) {
    return {
      label: 'Smart Contract Account',
      description: 'This is a smart contract account (has code deployed at this address)',
      class: 'text-blue-400'
    }
  }
  return {
    label: 'Regular Account',
    description: 'This is a regular account (EOA).',
    class: 'text-green-400'
  }
})

const explorerUrl = computed(() => {
  if (!address.value) return ''
  return `https://sepolia.explorer.zksync.io/address/${address.value}`
})

// Watch for address changes
watch(address, (newAddress) => {
  if (newAddress) {
    checkIfContract()
  } else {
    isContract.value = false
  }
})

// Run check when component mounts
onMounted(() => {
  if (address.value) {
    checkIfContract()
  }
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
        <!-- Account Type -->
        <div class="space-y-2">
          <label class="text-sm text-gray-400">Account Type</label>
          <div class="p-3 bg-gray-900/50 rounded-lg">
            <div v-if="isChecking" class="text-gray-400">
              Checking account type...
            </div>
            <template v-else>
              <div class="flex items-center gap-2">
                <div :class="accountType.class" class="font-medium">
                  {{ accountType.label }}
                </div>
                <a 
                  v-if="isContract" 
                  :href="explorerUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <div class="text-sm text-gray-400 mt-1">
                {{ accountType.description }}
              </div>
            </template>
          </div>
        </div>

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
