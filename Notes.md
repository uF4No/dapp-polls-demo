## Contracts

Scaffold: `forge init contracts`
Build: `forge build --zksync`
Deployment: `forge create --rpc-url zksync_era_sepolia --account myKeystore src/Poll.sol:PollContract --zksync`

Deployer: 0x466ff3c5C76445823b49dF047d72663B8eAe9272
Deployed to: 0x83fb0FF9650D534E336bE2f885dE9C93408aF2F0
Transaction hash: 0xb77d5fa5b3af5fa8074828b67b76fb6e7a322d151de13284288506f5386cbe02

Verification: `forge verify-contract 0x83fb0FF9650D534E336bE2f885dE9C93408aF2F0 src/Poll.sol:PollContract --zksync --verifier zksync --verifier-url https://explorer.sepolia.era.zksync.dev/contract_verification`

## Frontend

`npm create wagmi@latest`
`npm i`
`npm run dev`
