import { createPublicClient, http,  } from 'viem'
import { zksyncSepoliaTestnet } from '@wagmi/core/chains'
import { writeContract, waitForTransactionReceipt} from "@wagmi/core"
import {config} from "../wagmi"

export const CONTRACT_ADDRESS = '0xe888F8eDfd68F66c2a10AB1da561Cacb99AD9293'

export const ABI = [
    {
      "type": "function",
      "name": "createPoll",
      "inputs": [
        {
          "name": "_title",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "_optionOne",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "_optionTwo",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "_durationInMinutes",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getAllPollIds",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256[]",
          "internalType": "uint256[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getAllPolls",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PollContract.PollInfo[]",
          "components": [
            {
              "name": "id",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "title",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "deadline",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "owner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "optionOneVotes",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "optionTwoVotes",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getPoll",
      "inputs": [
        {
          "name": "_pollId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "id",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "owner",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "title",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "optionOne",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "optionTwo",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "optionOneVotes",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "optionTwoVotes",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "deadline",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "hasVoted",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getVoteStatus",
      "inputs": [
        {
          "name": "_pollId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_voter",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "pollIds",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "polls",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "id",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "owner",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "title",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "optionOne",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "optionTwo",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "optionOneVotes",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "optionTwoVotes",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "deadline",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "vote",
      "inputs": [
        {
          "name": "_pollId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_option",
          "type": "uint8",
          "internalType": "uint8"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "PollCreated",
      "inputs": [
        {
          "name": "pollId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "owner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "title",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "optionOne",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "optionTwo",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "deadline",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Voted",
      "inputs": [
        {
          "name": "pollId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "voter",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "option",
          "type": "uint8",
          "indexed": false,
          "internalType": "uint8"
        }
      ],
      "anonymous": false
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

  const getPoll = async (id: bigint) => {
    const poll = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'getPoll',
      args: [id]
    })
    console.log('poll details retrieved:>> ', poll)
    return poll
  }
  const vote = async (pollId: bigint, option: 1 | 2) => {
    console.log('voting on poll:>> ', pollId, option)
    const hash = await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'vote',
      args: [pollId, option]
    })
    console.log('vote tx hash:>> ', hash)

    const receipt = await waitForTransactionReceipt(config, { 
        hash,
        timeout: 60_000 // 60 seconds timeout
      })
      
      console.log('Transaction receipt:', receipt)
      
      if (receipt.status === 'reverted') {
        throw new Error('Transaction reverted')
      }

      return receipt
  }

  return {
    getAllPolls, createPoll, getPoll, vote
  }
} 
