import {waffle} from "@nomiclabs/buidler";
import chai from "chai";
import {deployContract, getWallets, solidity} from "ethereum-waffle";

import ContributionsArtifact from "../artifacts/Contributions.json";
import {Contributions} from "../typechain/Contributions";

chai.use(solidity);
const {expect} = chai;

describe.only("Contributions contract", () => {
    const provider = waffle.provider;

    let [wallet, recipientOne, senderOne] = provider.getWallets();

    let contributions: Contributions;

    beforeEach(async () => {
        contributions = (await deployContract(
            wallet,
            ContributionsArtifact
        )) as Contributions;
    });

    it("should be able to add a contribution", async () => {
        // console.log({ recipientOne });
        const {address: recipientAddress} = recipientOne;
        // console.log({recipientAddress});
        const nickname = "project-one";

        await contributions.addRecipient(recipientAddress, nickname);
        console.log(`Added recipient ${recipientAddress}`);

        let contributorAddresses = await contributions.listContributors(
            nickname
        );
        expect(contributorAddresses.length).to.eq(0);

        const {address: senderAddress} = senderOne;
        // console.log({senderAddress});
        const amount = 10;
        await contributions.contribute(senderAddress, nickname, amount);

        console.log(
            `${senderAddress} contributed ${amount} tokens to ${nickname}`
        );

        contributorAddresses = await contributions.listContributors(nickname);
        console.log({contributorAddresses});
        const contributedAmounts = await contributions.listAmounts(nickname);
        console.log({contributedAmounts});

        const numberOfContributions = 1;
        expect(contributorAddresses.length).to.eq(numberOfContributions);
        expect(contributedAmounts.length).to.eq(numberOfContributions);
        console.log(`${numberOfContributions} contributions as expected`);
    });
});
