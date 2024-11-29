import { http, cookieStorage, createConfig, createStorage } from '@wagmi/vue'
import {  zksyncSepoliaTestnet } from '@wagmi/vue/chains'
import { injected, metaMask, } from '@wagmi/vue/connectors'

export const config = createConfig({
  chains: [zksyncSepoliaTestnet],
  connectors: [
    injected(),
    
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [zksyncSepoliaTestnet.id]: http(),
    
  },
})

declare module '@wagmi/vue' {
  interface Register {
    config: typeof config
  }
}
