# ZKsync Polls Demo

![](./zksync-dark.png)

[Spanish version down below](#descripcion-general)

- Try the demo without SSO:https://zk-polls.netlify.app/
- Try the demo with SSO: https://zk-polls-sso.netlify.app/

## Overview

This is a demo app for a ZKsync-based poll application. Connected accounts can create polls with two options and vote on them.

## Contracts
The `contracts` folder contains the smart contract powering this app. Build with Foundry-zksync.
- `forge build --zksync`: compiles contrats
- `forge test -vv --zksync`: runs the tests
- `forge create --rpc-url zksync_era_sepolia --account myKeystore src/Poll.sol:PollContract --zksync`: deploys the contract on ZKsync Sepolia testnet
- `forge verify-contract 0xe888F8eDfd68F66c2a10AB1da561Cacb99AD9293 src/Poll.sol:PollContract --zksync --verifier zksync --verifier-url https://explorer.sepolia.era.zksync.dev/contract_verification`: verifies the contract on the ZKsync Sepolia testnet explorer.

> Contract is already deployed on ZKsync Sepolia testnet in the address [0xe888F8eDfd68F66c2a10AB1da561Cacb99AD9293](https://sepolia.explorer.zksync.io/address/0xe888F8eDfd68F66c2a10AB1da561Cacb99AD9293)

## Webapp

The `webapp` folder contains the frontend powering this app. Built with Vue 3 and Nuxt 3.

- `npm run dev`: starts the development server.

It uses `wagmi` to manage account and contract interactions. The logic to interact with the contract is in the `composables/usePollContract.ts` file.

## Connect with ZKsync SSO

The default `main` brach contains a basic setup with only the injected browser connector. Switch to the `feat/sso` branch to enable connetion using ZKsync SSO (`git checkout feat/sso`). [Learn more about ZKsync SSO here](https://docs.zksync.io/build/zksync-sso)

---

## Descripción general

Esta es una demostración para una aplicación de encuestas en ZKsync. Las cuentas conectadas pueden crear encuestas con dos opciones y votar en ellas.

### Contratos

La carpeta `contracts` contiene el contrato inteligente utilizado esta aplicación. Construido con Foundry-zksync.

- `forge build --zksync`: compila contratos
- `forge test -vv --zksync`: ejecuta los tests
- `forge create --rpc-url zksync_era_sepolia --account myKeystore src/Poll.sol:PollContract --zksync`: despliega el contrato en la red de prueba ZKsync Sepolia
- `forge verify-contract 0xe888F8eDfd68F66c2a10AB1da561Cacb99AD9293 src/Poll.sol:PollContract --zksync --verifier zksync --verifier-url https://explorer.sepolia.era.zksync.dev/contract_verification`: verifica el contrato en el explorador de la red de prueba ZKsync Sepolia.

> El contrato ya está desplegado en la red de prueba ZKsync Sepolia en la dirección [0xe888F8eDfd68F66c2a10AB1da561Cacb99AD9293](https://sepolia.explorer.zksync.io/address/0xe888F8eDfd68F66c2a10AB1da561Cacb99AD9293)

### Aplicación web

La carpeta `webapp` contiene el frontend que impulsa esta aplicación. Construido con Vue 3 y Nuxt 3.

- `npm run dev`: inicia el servidor de desarrollo.

Utiliza `wagmi` para gestionar las interacciones de cuenta y contrato. La lógica para interactuar con el contrato está en el archivo `composables/usePollContract.ts`.

### Conectar con ZKsync SSO

La rama `main` predeterminada contiene una configuración básica con solo el conector del navegador inyectado. Cambie a la rama `feat/sso` para habilitar la conexión usando ZKsync SSO (`git checkout feat/sso`). [Aprende más sobre ZKsync SSO aquí](https://docs.zksync.io/build/zksync-sso)
