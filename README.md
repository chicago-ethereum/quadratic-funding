# Chicago Ethereum Meetup QF / CLR Pilot

## Background

[Quadratic Funding](https://en.wikipedia.org/wiki/Quadratic_voting#Quadratic_funding) (QF) is a conceptual approach for funding public goods without relying on (or ceding control to) a central party to make allocation decisions. Put simply, individuals make contributions to the projects they care about, and those contributions are matched by shared funds such that smaller contributions are matched proportionally higher than large contributions. Projects that receive many small contributions, for example, will therefore end up with a greater total amount received than projects that receive a few several large contributions. 

[Constrained Liberal Radicalism](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3243656) (CLR) is a practical approach to QF that sets an explicit budget for the matching funds.

This project implements a CLR system to fund public goods for the [Chicago Ethereum](https://www.meetup.com/Chicago-Ethereum-Meetup) ecosystem and meetup group.

`// TODO: Add info about quadratic funding and constrained liberal radicalism`

## Instructions for participating

#### Date range

Tue Feb 11 2020 6pm CST - ~ Tue Feb 18 2020 6pm CST (not exact: using block number and average block time)

## Eligible projects <a name="project_nicknames"></a>

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

A Chicago Ethereum version of [PoolTogether](https://www.pooltogether.com).

### humanity_dao

A Chicago Ethereum version of the [Humanity DAO](https://www.humanitydao.org) registry of verified humans. This registry could be used for a number of things, such as an anti-Sybil whitelist for future Chicago Ethereum funding rounds, governance decisions, or even just games!

### pizza

Funds for food and drinks at Chicago Ethereum meetups. Could help attract more people to Ethereum!

### unisocks

A Chicago Ethereum version of [Unisocks](https://unisocks.exchange), a fun experiment selling phsyical socks via a token on Uniswap. Exact item of clothing TBD &mdash; could be a shirt, socks, a beanie, etc.

### bonding_curve

Funds to seed the reserve currency in a bonding curve that mints (and buys back) Chicago Ethereum tokens. These tokens could be used for a number of things within the Chicago Ethereum ecosystem, such as governance voting, swag purchases, and lots of things we've yet to dream up.

### coffee_coin

A protocol for tokenizing small favors (e.g. buying somebody a coffee), creating a "favor economy".

### coffee_forward

A dapp that makes it easy for people to pay for coffee (or tea!) for somebody else in line behind them, and perhaps to be recognized for their generosity.

### budgeting_dao

A dapp that facilitates group budget allocation and manages spending permissions.

#### Steps

1. Getting initial funds for voting

   `// TODO: Add Typeform link` where we'll collect our Ethereum addresses (not private keys!) for the Linkdrop as well as `instructions for sharing your address via Keybase`.

   `// TODO: Add Linkdrop link so people can look into what Linkdrop is`

1. _Optional:_ Using additional funds

   It's `DAI`, so in theory if you feel strongly you can contribute as much as you like.

1. Approve the contract to spend `DAI` on your behalf

   [Etherscan link](https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f#writeContract) for DAI's ERC20 token page where you can write to the contract
   
   Alternatively, here is a `oneclickdapp` for the DAI contract: [oneclickdapp.com/marvin-elvis/](https://oneclickdapp.com/marvin-elvis/)

   This is the contract address you need to approve: [`0xaD4a34A7854138d6A8A0254F793AC3510090e9e5`](https://etherscan.io/address/0xad4a34a7854138d6a8a0254f793ac3510090e9e5)
   
   <a name="duckduckgo"></a> Use duckduckgo.com to write `10^18` or `10**18` and have the number appear not in scientific notation (like it does in Google). Because DAI has 18 decimal places, this the equivalent of 1 DAI. So to use 10 DAI, that's `10 * 10^18 = 10^19`

1. _Optional but a good practice:_ Take a look at [the contracts](./contract-project) to confirm that they do what we say they do.

1. Contribute to a project

   Use the `contribute` function in the write tab (after approving our contract to spend DAI!). You'll need to type in the name of the project you're contributing to (see [project nicknames](#project_nicknames) above) as well as the amount you want to contribute.
   
   Use the same [duckduckgo.com method](#duckduckgo) described above for converting the amount of DAI you want to contribute (e.g. 3 DAI) to the proper number (e.g. `3 * 10^18`)

   [https://oneclickdapp.com/miranda-pancake/](https://oneclickdapp.com/miranda-pancake/)

## Code

### Smart contracts

See [`contract-project`](./contract-project) dir for the smart contracts

### QF / CLR calculations and visualization

See [`matching`](./matching) dir for the QF / CLR calculation code

## Instructions to set up your own fork of this project

- Remember to call `setToken`
- Remember to add projects beforehand
- Look at the scripts in [`contract-project/package.json`](./contract-project/package.json) to see how to build, test, and deploy the contracts
