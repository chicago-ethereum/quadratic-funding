# QF / CLR smart contracts

These are the smart contracts for the Chicago Ethereum Meetup's quadratic funding / CLR pilot.

We're using [`buidler`](https://buidler.dev) as the platform layer to orchestrate all the tasks. [`ethers`](https://docs.ethers.io/ethers.js/html/) is used for all Ethereum interactions and testing. `TypeChain` is used in order to have TypeScript typings for the contracts.

## Using this Project

Clone this repository, then install the dependencies with `npm install`. Build everything with `npm run build`. https://buidler.dev has excellent docs, and can be used as reference for extending this project.

## Available Functionality

### Compile Contracts and generate TypeChain typings

`npm run build`

### Run Contract Tests

`npm run test`

### Deploy to Ethereum

Modify network config in `buidler.config.ts` and get API key and private key via an env file not in source control, and then run:

`npx buidler run --network rinkeby scripts/deploy.ts`

### Verify on Etherscan

Add Etherscan API key to `buidler.config.ts`, then run:

`npx buidler verify-contract --contract-name <CONTRACT NAME> --address <DEPLOYED ADDRESS>`

## Notes

PRs and feedback welcome!
