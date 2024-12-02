import { createPublicClient, http,  } from 'viem'
import { zksyncSepoliaTestnet } from '@wagmi/core/chains'
import {getAccount, writeContract, waitForTransactionReceipt} from "@wagmi/core"
import {config} from "../wagmi"

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

interface CreatePollParams {
  title: string
  optionOne: string
  optionTwo: string
  durationInMinutes: bigint
}

export async function usePollContract() {
  
  const publicClient = createPublicClient({
    chain: zksyncSepoliaTestnet,
    transport: http('https://sepolia.era.zksync.dev')
  })


  const createPoll = async({ title, optionOne, optionTwo, durationInMinutes }: CreatePollParams) => { 
    try {
      console.log('Creating poll with params:', { title, optionOne, optionTwo, durationInMinutes })
      
      const hash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'createPoll',
        args: [title, optionOne, optionTwo, durationInMinutes]
      })
      
      console.log('Transaction hash:', hash)
      
      const receipt = await waitForTransactionReceipt(config, { 
        hash,
        timeout: 60_000 // 60 seconds timeout
      })
      
      console.log('Transaction receipt:', receipt)
      
      if (receipt.status === 'reverted') {
        throw new Error('Transaction reverted')
      }

      return receipt
    } catch (error) {
      console.error('Error in createPoll:', error)
      throw error
    }
  }


  const getAllPolls = async () => {
    try {
      const polls = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'getAllPolls',
      })
      console.log('polls :>> ', polls)
      return polls
    } catch (error) {
      console.error('Error fetching polls:', error)
      throw error
    }
  }

  return {
    getAllPolls, createPoll
  }
} 
