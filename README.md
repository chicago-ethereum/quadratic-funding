# Chicago Ethereum Meetup QF / CLR pilot

## Background

`// TODO: Add info about quadratic funding and constrained liberal radicalism`

## Instructions for participating

#### Date range

Tue Feb 11 2020 6pm CST - ~ Tue Feb 18 2020 6pm CST (not exact: using block number and average block time)

#### Eligible projects

`// TODO: Add this list`

- Pizza
- ...

#### Steps

1. Getting initial funds for voting

   [HackMD link](https://hackmd.io/zAkvlWeSTu6xVOSvlwyBTg/edit) where we'll collect our Ethereum addresses (not private keys!) for the Linkdrop.

   `// TODO: Add linkdrop link`

1. _Optional:_ Using additional funds

   It's `DAI`, so in theory if you feel strongly you can contribute as much as you like.

1. Approve the contract to spend token on your behalf

   [Etherscan link](https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f#writeContract) for DAI token to approve our contract to transfer it on your behalf

1. _Optional but a good practice:_ Take a look at [the contracts](<(./contract-project)>) to confirm that they do what we say they do.

1. Contribute to a project

   `// TODO: Add oneclickdapp link`

## Code

### Smart contracts

See [`contract-project`](./contract-project) dir for the smart contracts

### QF / CLR calculations and visualization

See [`matching`](./matching) dir for the QF / CLR calculation code

## Instructions to set up your own fork of this project

- Remember to call `setToken`.
- Remember to add projects beforehand.
- Look at the scripts in [`contract-project/package.json`](./contract-project/package.json) to see how to build, test, and deploy the contracts.
