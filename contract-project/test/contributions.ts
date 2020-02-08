import {waffle} from "@nomiclabs/buidler";
import chai from "chai";
import {deployContract, solidity} from "ethereum-waffle";

import ContributionsArtifact from "../artifacts/Contributions.json";
import {Contributions} from "../typechain/Contributions";
import CEMArtifact from "../artifacts/CEM.json";
import {CEM} from "../typechain/CEM";

chai.use(solidity);
const {expect} = chai;

describe.only("Contributions contract", () => {
    const provider = waffle.provider;

    let [wallet, recipientOne, senderOne] = provider.getWallets();

    let contributions: Contributions;
    let cem: CEM;

    beforeEach(async () => {
        contributions = (await deployContract(
            wallet,
            ContributionsArtifact
        )) as Contributions;
        cem = (await deployContract(wallet, CEMArtifact, [10])) as CEM;
        const {address: cemAddress} = cem;
        console.log({cemAddress});
        await contributions.setToken(cemAddress);

        // TODO: Mint ERC20 tokens for the sender so that
        // the test will pass
        // Error: VM Exception while processing transaction:
        // revert ERC20: transfer amount exceeds balance
        // at CEM.sub (@openzeppelin/contracts/math/SafeMath.sol:58)
        // at CEM._transfer (@openzeppelin/contracts/token/ERC20/ERC20.sol:158)
        // at CEM.transferFrom (@openzeppelin/contracts/token/ERC20/ERC20.sol:99)
        // at Contributions._deliverTokens (contracts/Contributions.sol:152)
        // at Contributions.contribute (contracts/Contributions.sol:83)
    });

    // Note: Real unit tests should be smaller than this
    // and the shared parts should move into a beforeEach hook
    // Just wrote this literally as quickly as possible
    it("should be able to add a contribution", async () => {
        const amount = 10;
        let numberOfContributions = 0;

        const {address: recipientAddress} = recipientOne;
        const nickname = "project-one";

        await contributions.addRecipient(recipientAddress, nickname);
        console.log(`Added recipient ${recipientAddress}`);

        let contributorAddresses = await contributions.listContributors(
            nickname
        );
        expect(contributorAddresses.length).to.eq(0);

        const {address: senderAddress} = senderOne;

        await contributions.contribute(senderAddress, nickname, amount);
        numberOfContributions += 1;

        console.log(
            `${senderAddress} contributed ${amount} tokens to ${nickname}`
        );

        contributorAddresses = await contributions.listContributors(nickname);
        console.log({contributorAddresses});
        const contributedAmounts = await contributions.listAmounts(nickname);
        console.log({contributedAmounts});

        const contributionCount = await contributions.getContributionCount(
            nickname
        );

        expect(contributorAddresses.length).to.eq(numberOfContributions);
        expect(contributedAmounts.length).to.eq(numberOfContributions);
        expect(contributionCount).to.eq(numberOfContributions);
        console.log(`${numberOfContributions} contributions as expected`);

        const firstIndex = 0;
        const firstContributorAddress = await contributions.getContributorAtIndex(
            nickname,
            firstIndex
        );
        expect(firstContributorAddress).to.eq(senderAddress);
        const firstContributedAmount = await contributions.getAmountAtIndex(
            nickname,
            firstIndex
        );
        expect(firstContributedAmount).to.eq(amount);
    });
});
