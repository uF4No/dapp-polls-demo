<script setup lang="ts">
import { ref } from 'vue'
import { useAccount, useTransaction } from '@wagmi/vue'

const { address, status } = useAccount()
const { data: hash, isLoading: isWaiting } = useTransaction()

// Form state
const title = ref('')
const optionOne = ref('')
const optionTwo = ref('')
const duration = ref(60) // Default 60 minutes
const isSubmitting = ref(false)
const error = ref<string | null>(null)

// Redirect if not connected
if (status.value === 'disconnected') {
  navigateTo('/')
}

const { createPoll } = usePollContract()

const handleSubmit = async () => {
  if (!address.value) {
    error.value = 'Please connect your wallet first'
    return
  }

  error.value = null
  isSubmitting.value = true

  try {
    const contract = await usePollContract()
    const hash = await contract.createPoll({
      title: title.value,
      optionOne: optionOne.value,
      optionTwo: optionTwo.value,
      durationInMinutes: duration.value
    })

    await useTransaction({ hash })
    navigateTo('/')
  } catch (err) {
    console.error('Error creating poll:', err)
    error.value = err instanceof Error ? err.message : 'Failed to create poll'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50">
      <h2 class="text-2xl font-bold text-gray-100 mb-6">Create New Poll</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Poll Title</label>
          <input
            v-model="title"
            type="text"
            required
            class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="What's your question?"
          />
        </div>

        <!-- Options -->
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Option 1</label>
            <input
              v-model="optionOne"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="First option"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Option 2</label>
            <input
              v-model="optionTwo"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Second option"
            />
          </div>
        </div>

        <!-- Duration -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
          <input
            v-model="duration"
            type="number"
            required
            min="1"
            class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-4 bg-red-500/10 text-red-400 rounded-lg">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="navigateTo('/')"
            class="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
          >
            <span v-if="isSubmitting">Creating...</span>
            <span v-else>Create Poll</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template> 
