<script setup lang="ts">
import { useAccount, useDisconnect } from '@wagmi/vue'
import { useConnect, useChainId } from '@wagmi/vue'
import { ref } from 'vue'
import { navigateTo } from 'nuxt/app'

const isOpen = ref(false)
const chainId = useChainId()
const { connect, connectors } = useConnect()
const { address, status } = useAccount()
const { disconnect } = useDisconnect()

const shortenAddress = (addr: string) => {
  if (!addr) return ''
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const handleConnect = (connector: any) => {
  connect({ connector, chainId })
  closeDropdown()
}

const navigateToAccount = () => {
  navigateTo('/account')
}

const navigateToHome = () => {
  navigateTo('/')
}
</script>

<template>
  <nav class="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex-shrink-0">
          <h1 
            @click="navigateToHome" 
            class="text-xl font-bold text-primary-500 cursor-pointer hover:text-primary-400 transition-colors"
          >
            ZKPolls
          </h1>
        </div>
        
        <div class="relative">
          <div v-if="status === 'connected'" class="flex items-center space-x-4">
            <button
              @click="navigateToAccount"
              class="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {{ shortenAddress(address!) }}
            </button>
            <button
              @click="disconnect"
              class="text-sm px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
            >
              Disconnect
            </button>
          </div>
          
          <div v-else class="relative">
            <button
              @click="toggleDropdown"
              class="flex items-center px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors"
            >
              Connect Wallet
            </button>
            
            <div
              v-if="isOpen"
              class="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 border border-gray-700 shadow-xl"
            >
              <div class="py-2">
                <button
                  v-for="connector in connectors"
                  :key="connector.id"
                  @click="handleConnect(connector)"
                  class="flex items-center px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                  <img :src="connector.icon" alt="Connector Icon" class="mr-2 h-4 w-4" />
                  {{ connector.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template> 
