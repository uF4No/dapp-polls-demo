import { http, cookieStorage, createConfig, createStorage } from '@wagmi/vue'
import {  zksyncSepoliaTestnet } from '@wagmi/vue/chains'
import { injected, } from '@wagmi/vue/connectors'
import {connect} from '@wagmi/core'
import {zksyncSsoConnector, callPolicy} from "zksync-sso/connector"

import {ABI, CONTRACT_ADDRESS} from "@/composables/usePollContract"

const ssoConnector = zksyncSsoConnector({
  metadata:{
    name: "ZK Polls",
    icon: "https://nft.zksync.dev/favicon.svg",
  },
  session:{
    contractCalls:[
      callPolicy({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'vote',
      }),
      callPolicy({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'createPoll',
      })
    ]
  }

})

export const config = createConfig({
  chains: [zksyncSepoliaTestnet],
  connectors: [
    injected(),
    ssoConnector,
    
  ],
  // storage: createStorage({
  //   storage: cookieStorage,
  // }),
  // ssr: true,
  transports: {
    [zksyncSepoliaTestnet.id]: http(),
    
  },
})

export const connectWithSSO = async () => {
  connect(config, {
    connector: ssoConnector,
    chainId: zksyncSepoliaTestnet.id,
  });
}

declare module '@wagmi/vue' {
  interface Register {
    config: typeof config
  }
}
