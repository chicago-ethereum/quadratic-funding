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

   `// TODO: Add Typeform link` where we'll collect our Ethereum addresses (not private keys!) for the Linkdrop as well as `instructions for sharing your address via Keybase`.

   `// TODO: Add Linkdrop link so people can look into what Linkdrop is`

1. _Optional:_ Using additional funds

   It's `DAI`, so in theory if you feel strongly you can contribute as much as you like.

1. Approve the contract to spend `DAI` on your behalf

   [Etherscan link](https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f#writeContract) for DAI's ERC20 token page where you can write to the contract
   
   Alternatively, here is a `oneclickdapp` for the DAI contract: [oneclickdapp.com/marvin-elvis/](https://oneclickdapp.com/marvin-elvis/)

   This is the contract address you need to approve: [`0xaD4a34A7854138d6A8A0254F793AC3510090e9e5`](https://etherscan.io/address/0xad4a34a7854138d6a8a0254f793ac3510090e9e5)
   
   Use duckduckgo.com to write `10^18` or `10**18` and have the number appear not in scientific notation (like it does in Google). Because DAI has 18 decimal places, this the equivalent of 1 DAI. So to use 10 DAI, that's `10 * 10^18 = 10^19`

1. _Optional but a good practice:_ Take a look at [the contracts](./contract-project) to confirm that they do what we say they do.

1. Contribute to a project

   Use the `contribute` function in the write tab (after approving our contract to spend DAI!)

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
