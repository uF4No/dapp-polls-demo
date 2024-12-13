<script setup lang="ts">
import { useAccount } from '@wagmi/vue';
interface Poll {
  id: bigint
  title: string
  deadline: bigint
  owner: string
  optionOneVotes: bigint
  optionOne: string
  optionTwoVotes: bigint
  optionTwo: string
}

const route = useRoute()
const account = useAccount()
console.log('account:>> ', account)
const { address } = useAccount()
const pollContract = await usePollContract()
const { data: poll, pending } = await useAsyncData<Poll>(
  `poll-${route.params.id}`,
  async () => {
    const pollData = await pollContract.getPoll(BigInt(route.params.id as string))
    return {
      id: pollData[0],
      title: pollData[2],
      deadline: pollData[7],
      owner: pollData[1],
      optionOneVotes: pollData[5],
      optionTwoVotes: pollData[6],
      optionOne: pollData[3],
      optionTwo: pollData[4]
    } as Poll
  }
)

const loading = ref(false)
const error = ref('')

const vote = async (option: 1 | 2) => {
  if (!poll.value) return
  
  loading.value = true
  error.value = ''
  

  try {
    console.log('account:>> ', account)
    console.log(poll.value.owner.toLowerCase(), address.value?.toLowerCase())
    if (poll.value.owner.toLowerCase() === address.value?.toLowerCase()) {
      error.value = 'You cannot vote on your own poll.'
      return
    }
    const receipt = await pollContract.vote(poll.value.id, option)
    // Refresh poll data after voting
    console.log('Transaction receipt:', receipt)
    
    if (receipt.status === 'success') {
      await refreshNuxtData(`poll-${route.params.id}`)
    }else {
      throw new Error('Transaction failed')
    }
  } catch (err) {
    error.value = 'Failed to submit vote. Please try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatDeadline = (deadline: bigint) => {
  const date = new Date(Number(deadline) * 1000)
  return date.toLocaleString()
}

const isActive = (deadline: bigint) => {
  return Date.now() < Number(deadline) * 1000
}

const totalVotes = computed(() => {
  if (!poll.value) return 0n
  return poll.value.optionOneVotes + poll.value.optionTwoVotes
})

const getVotePercentage = (votes: bigint) => {
  if (!poll.value || totalVotes.value === 0n) return 0
  return Number((votes * 100n) / totalVotes.value)
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <div v-if="pending" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <template v-else-if="poll">
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <h1 class="text-3xl font-bold text-gray-100">{{ poll.title }}</h1>
        
        <div class="mt-4 space-y-6">
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

          <!-- Poll Info -->
          <div class="text-sm text-gray-400 space-y-2">
            <p>Created by: {{ poll.owner }}</p>
            <p>Ends: {{ formatDeadline(poll.deadline) }}</p>
            <p>Total Votes: {{ totalVotes.toString() }}</p>
          </div>

          <!-- Voting Options -->
          <div class="space-y-4">
            <div v-for="(option, index) in [1, 2]" :key="index"
              class="flex gap-4 items-center"
            >
              <div class="flex-1 p-4 bg-gray-700/50 rounded-lg">
                <div class="flex justify-between items-center">
                  <span>{{ index === 0 ? poll.optionOne : poll.optionTwo }}</span>
                  <span>{{ getVotePercentage(index === 0 ? poll.optionOneVotes : poll.optionTwoVotes) }}%</span>
                </div>
                <div class="mt-2 w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    class="bg-primary-500 h-2.5 rounded-full transition-all"
                    :style="{ width: `${getVotePercentage(index === 0 ? poll.optionOneVotes : poll.optionTwoVotes)}%` }"
                  />
                </div>
              </div>

              <button
                @click="vote(option)"
                :disabled="!isActive(poll.deadline) || loading"
                class="h-full aspect-square p-4 bg-gray-700/50 rounded-lg hover:bg-primary-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon 
                  name="material-symbols:how-to-vote" 
                  class="text-xl text-primary-500"
                  :class="{ 'animate-spin': loading }"
                />
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
        </div>
      </div>
    </template>

    <div v-else class="text-center text-gray-400">
      Poll not found
    </div>
  </div>
</template> 
