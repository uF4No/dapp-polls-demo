import { createPublicClient, createWalletClient, http } from 'viem'
import { zksyncSepoliaTestnet } from '@wagmi/core/chains'

const CONTRACT_ADDRESS = '0x83fb0FF9650D534E336bE2f885dE9C93408aF2F0'

const ABI = [
  {
    inputs: [],
    name: 'getAllPolls',
    outputs: [{
      components: [
        { name: 'id', type: 'uint256' },
        { name: 'title', type: 'string' },
        { name: 'deadline', type: 'uint256' },
        { name: 'owner', type: 'address' },
        { name: 'optionOneVotes', type: 'uint256' },
        { name: 'optionTwoVotes', type: 'uint256' }
      ],
      internalType: 'struct PollContract.PollInfo[]',
      name: '',
      type: 'tuple[]'
    }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: '_title', type: 'string' },
      { name: '_optionOne', type: 'string' },
      { name: '_optionTwo', type: 'string' },
      { name: '_durationInMinutes', type: 'uint256' }
    ],
    name: 'createPoll',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const

export async function usePollContract() {
  
  const publicClient = createPublicClient({
    chain: zksyncSepoliaTestnet,
    transport: http('https://sepolia.era.zksync.dev')
  })

  const getAllPolls = async () => {
    try {
      const polls = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'getAllPolls',
      })
      return polls
    } catch (error) {
      console.error('Error fetching polls:', error)
      throw error
    }
  }

  return {
    getAllPolls
  }
} 
