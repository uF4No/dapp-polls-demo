<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAccount } from '@wagmi/vue'

interface Poll {
  id: bigint
  title: string
  deadline: bigint
  owner: string
  optionOneVotes: bigint
  optionTwoVotes: bigint
}

const { address, status } = useAccount()
const pollContract = await usePollContract()
const polls = ref<Poll[]>([])
const loading = ref(true)

const formatDeadline = (deadline: bigint) => {
  const date = new Date(Number(deadline) * 1000)
  return date.toLocaleString()
}

const isActive = (deadline: bigint) => {
  return Date.now() < Number(deadline) * 1000
}

const fetchPolls = async () => {
  loading.value = true
  try {
    polls.value = await pollContract.getAllPolls()
    console.log('polls :>> ', polls.value)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const formatSlug = (id: bigint) => `/poll/${id}`

onMounted(() => {
  fetchPolls()
})
</script>

<template>
  <div class="space-y-12">
    <header class="text-center">
      <h2 class="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Welcome to ZK Polls
      </h2>
      <p class="mt-4 text-lg text-gray-400">Create and participate in decentralized polls</p>
      <div class="mt-6" v-if="status === 'connected'">
        <NuxtLink
          to="/create"
          class="inline-flex items-center gap-2 px-6 py-3 font-medium bg-primary-500 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:bg-primary-600 hover:shadow-primary-600/20 transition-all active:transform active:scale-95"
        >
          <Icon name="heroicons:plus-circle" class="w-5 h-5" />
          Create new Poll
        </NuxtLink>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- No Polls State -->
    <div v-else-if="!polls.length" class="text-center py-12">
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-4 text-xl font-medium text-gray-300">No open polls yet</h3>
        <p class="mt-2 text-gray-400">Be the first one to create a poll!</p>
        
        <NuxtLink
          v-if="status === 'connected'"
          to="/create"
          class="inline-flex items-center gap-2 px-6 py-3 font-medium bg-primary-500 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:bg-primary-600 hover:shadow-primary-600/20 transition-all active:transform active:scale-95"
        >
          <Icon name="heroicons:plus-circle" class="w-5 h-5" />
          Create new Poll
        </NuxtLink>
      </div>
    </div>

    <!-- Polls Grid -->
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="poll in polls"
        :key="String(poll.id)"
        :to="status === 'connected' ? formatSlug(poll.id) : '#'"
        :class="[
          'block bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 transition-all',
          status === 'connected' ? 'hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/5' : 'cursor-not-allowed opacity-80'
        ]"
        :aria-disabled="status !== 'connected'"
      >
        <div class="space-y-4">
          <!-- Title -->
          <h3 class="text-xl font-semibold text-gray-100">{{ poll.title }}</h3>

          <!-- Status Badge -->
          <div 
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              isActive(poll.deadline) 
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            ]"
          >
            {{ isActive(poll.deadline) ? 'Active' : 'Ended' }}
          </div>

          <!-- Vote Count -->
          <div class="flex justify-between text-sm text-gray-400">
            <span>Total Votes: {{ (poll.optionOneVotes + poll.optionTwoVotes).toString() }}</span>
            <span>Ends: {{ formatDeadline(poll.deadline) }}</span>
          </div>

          <!-- Vote Progress Bar -->
          <div class="w-full bg-gray-700 rounded-full h-2.5">
            <div
              class="bg-primary-500 h-2.5 rounded-full"
              :style="{
                width: `${Number(poll.optionOneVotes) / (Number(poll.optionOneVotes) + Number(poll.optionTwoVotes)) * 100 || 0}%`
              }"
            ></div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template> 
