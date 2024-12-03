## Contracts

Scaffold: `forge init contracts`
Build: `forge build --zksync`
Deployment: `forge create --rpc-url zksync_era_sepolia --account myKeystore src/Poll.sol:PollContract --zksync`

Deployer: 0x466ff3c5C76445823b49dF047d72663B8eAe9272
Deployed to: 0xe888F8eDfd68F66c2a10AB1da561Cacb99AD9293
Transaction hash: 0x5fb3c63b1cc065b0272bc014bc4f772e3288ee16facff6b20850fa9d73b002ae

Verification: `forge verify-contract 0xe888F8eDfd68F66c2a10AB1da561Cacb99AD9293 src/Poll.sol:PollContract --zksync --verifier zksync --verifier-url https://explorer.sepolia.era.zksync.dev/contract_verification`

## Frontend

`npm create wagmi@latest`
`npm i`
`npm run dev`
