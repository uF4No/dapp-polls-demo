<script setup lang="ts">
import { ref } from 'vue'
import { useAccount, useTransaction } from '@wagmi/vue'
import { navigateTo } from '#app'

const { address, status } = useAccount()
const waitForTransaction = useTransaction()

// Form state
const title = ref('')
const optionOne = ref('')
const optionTwo = ref('')
const duration = ref(60)
const isSubmitting = ref(false)
const error = ref<string | null>(null)

// Redirect if not connected
if (status.value === 'disconnected') {
  navigateTo('/')
}

const pollContract = await usePollContract()

const handleSubmit = async () => {
  if (!address.value) {
    error.value = 'Please connect your wallet first'
    return
  }

  error.value = null
  isSubmitting.value = true

  try {
    const receipt = await pollContract.createPoll({
      title: title.value,
      optionOne: optionOne.value,
      optionTwo: optionTwo.value,
      durationInMinutes: BigInt(duration.value)
    })

    console.log('Transaction receipt:', receipt)
    
    if (receipt.status === 'success') {
      // Wait a bit to ensure blockchain state is updated
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigateTo('/')
    } else {
      throw new Error('Transaction failed')
    }
  } catch (err) {
    console.error('Error creating poll:', err)
    error.value = err instanceof Error ? err.message : 'Failed to create poll'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-4 space-y-8">
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <h1 class="text-xl font-bold mb-6">Create New Poll</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Poll Title -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-200">
            Poll Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="title"
            type="text"
            placeholder="What's your question?"
            :disabled="isSubmitting"
            required
            maxlength="100"
            class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Option 1 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-200">
            Option 1 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="optionOne"
            type="text"
            placeholder="First option"
            :disabled="isSubmitting"
            required
            maxlength="50"
            class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Option 2 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-200">
            Option 2 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="optionTwo"
            type="text"
            placeholder="Second option"
            :disabled="isSubmitting"
            required
            maxlength="50"
            class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Duration -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-200">
            Duration (minutes) <span class="text-red-500">*</span>
          </label>
          <input
            v-model="duration"
            type="number"
            :min="1"
            :max="10080"
            :disabled="isSubmitting"
            required
            class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-500 text-sm mt-2">
          {{ error }}
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="navigateTo('/')"
            :disabled="isSubmitting"
            class="px-4 py-2 rounded-lg text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="isSubmitting" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></span>
            {{ isSubmitting ? 'Creating...' : 'Create Poll' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
