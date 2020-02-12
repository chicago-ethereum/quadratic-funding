# Chicago Ethereum Meetup QF / CLR pilot

## Background

`// TODO: Add info about quadratic funding and constrained liberal radicalism`

## Instructions for participating

#### Date range

Tue Feb 11 2020 6pm CST - ~ Tue Feb 18 2020 6pm CST (not exact: using block number and average block time)

## Eligible projects

| Project nickname | Multisig address |
| ------------- | ------------- |
| noloss_lotto | [`0x5c5D70a1AF09F1246fA20E4E118e842c1c6893E7`](https://gnosis-safe.io/safes/0x5c5D70a1AF09F1246fA20E4E118e842c1c6893E7/balances) |
| humanity_dao  | [`0x0ce9229c0efde424ece564c3cc4edd96fade2b07`](https://gnosis-safe.io/safes/0x0ce9229c0efde424ece564c3cc4edd96fade2b07/balances) |
| pizza  | [`0x059686e72f1e970da96e335f02e49da3933fa0f6`](https://gnosis-safe.io/safes/0x059686e72f1e970da96e335f02e49da3933fa0f6/balances) |
| unisocks  | [`0x76224d2799A12021829fdB6164a04D0c5475aB77`](https://gnosis-safe.io/safes/0x76224d2799A12021829fdB6164a04D0c5475aB77/balances) |
| bonding_curve  | [`0x675c86f06c923ce025ed90d57324915a0f8e7f5a`](https://gnosis-safe.io/safes/0x675c86f06c923ce025ed90d57324915a0f8e7f5a/balances) |
| coffee_coin  | [`0x5268b5f777C3e058650926861041Bb3BeD219252`](https://gnosis-safe.io/safes/0x5268b5f777C3e058650926861041Bb3BeD219252/balances) |
| coffee_forward | [`0xf17009e4d3660896A0Ca57Ea45E94937759846c9`](https://gnosis-safe.io/safes/0xf17009e4d3660896A0Ca57Ea45E94937759846c9/balances) |
| budgeting_dao | [`0x85284271b7538681bcce162272bf1227f1015811`](https://gnosis-safe.io/safes/0x85284271b7538681bcce162272bf1227f1015811/balances) |

## Project descriptions

### noloss_lotto

### humanity_dao

### pizza

### unisocks

### bonding_curve

### coffee_coin

### coffee_forward

### budgeting_dao

#### Steps

1. Getting initial funds for voting

   `// TODO: Add Typeform link` where we'll collect our Ethereum addresses (not private keys!) for the Linkdrop as well as `instructions for sharing your address via Keybase`.

   `// TODO: Add Linkdrop link so people can look into what Linkdrop is`

1. _Optional:_ Using additional funds

   It's `DAI`, so in theory if you feel strongly you can contribute as much as you like.

1. Approve the contract to spend `DAI` on your behalf

   [Etherscan link](https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f#writeContract) for DAI's ERC20 token page where you can write to the contract

   `// TODO: Add our contract address and Etherscan link here`

1. _Optional but a good practice:_ Take a look at [the contracts](./contract-project) to confirm that they do what we say they do.

1. Contribute to a project

   `// TODO: Add oneclickdapp link`

## Code

### Smart contracts

See [`contract-project`](./contract-project) dir for the smart contracts

### QF / CLR calculations and visualization

See [`matching`](./matching) dir for the QF / CLR calculation code

## Instructions to set up your own fork of this project

- Remember to call `setToken`
- Remember to add projects beforehand
- Look at the scripts in [`contract-project/package.json`](./contract-project/package.json) to see how to build, test, and deploy the contracts
