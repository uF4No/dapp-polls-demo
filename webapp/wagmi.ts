import { http, cookieStorage, createConfig, createStorage } from '@wagmi/vue'
import {  zksyncSepoliaTestnet } from '@wagmi/vue/chains'
import { injected, } from '@wagmi/vue/connectors'
import {connect} from '@wagmi/core'
import {zksyncSsoConnector} from "zksync-sso/connector"

const ssoConnector = zksyncSsoConnector({
  metadata:{
    name: "ZK Polls",
    icon: "https://nft.zksync.dev/favicon.svg",
  },

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
