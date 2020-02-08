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

    let [
        ownerWalletObject,
        recipientWalletObject,
        senderWalletObject,
        approvedWalletObject
    ] = provider.getWallets();

    const {address: ownerAddress} = ownerWalletObject;
    const {address: senderAddress} = senderWalletObject;
    const {address: recipientAddress} = recipientWalletObject;
    const {address: approvedWalletAddress} = approvedWalletObject;
    console.log({ownerAddress});
    console.log({senderAddress});
    console.log({recipientAddress});
    console.log({approvedWalletAddress});

    let contributions: Contributions;
    let cem: CEM;
    let cemWithSender: CEM;

    // TODO: Use an address type rather than the more generic string
    let contributionsAddress: string;

    beforeEach(async () => {
        contributions = (await deployContract(
            ownerWalletObject,
            ContributionsArtifact
        )) as Contributions;

        contributionsAddress = contributions.address;
        console.log({contributionsAddress});

        const initialSupply = 100;

        // Note: Initially the sender of the deploy tx has all of the initial supply
        cem = (await deployContract(ownerWalletObject, CEMArtifact, [
            initialSupply
        ])) as CEM;

        const {address: cemAddress} = cem;
        console.log({cemAddress});

        // Double-check that we set up:
        // (A) the initial token supply
        // and
        // (B) the balance of the owner account correctly
        const totalSupply = await cem.totalSupply();
        expect(totalSupply).to.equal(initialSupply);
        const ownerBalance = await cem.balanceOf(ownerAddress);
        expect(ownerBalance).to.equal(initialSupply);

        // Pick the token that will be tracked for QF/CLR purposes
        await contributions.setToken(cemAddress);

        // Give the sender account some tokens to contribute to projects
        const senderInitialAmount = 20;
        await cem.transfer(senderAddress, senderInitialAmount);
        const senderBalance = await cem.balanceOf(senderAddress);
        expect(senderBalance).to.equal(senderInitialAmount);
        console.log({senderBalance});
    });

    // Note: Real unit tests should be smaller than this
    // and the shared parts should move into a beforeEach hook
    // Just wrote this literally as quickly as possible
    it("should be able to add a contribution", async () => {
        const amount = 10;
        let currentNumberOfContributions = 0;

        const nickname = "project-one";

        // As admin
        await contributions.addRecipient(recipientAddress, nickname);
        console.log(`Added recipient ${recipientAddress}`);

        // Reading public data, sender doesn't matter because it isn't a tx
        let contributorAddresses = await contributions.listContributors(
            nickname
        );
        expect(contributorAddresses.length).to.eq(0);

        // ---
        // TODO: Remove this block - just using to test balance error
        // ---
        // "Become" the sender wallet for future transactions with the cem contract
        cemWithSender = cem.connect(senderWalletObject);
        const {signer} = cemWithSender;
        console.log({signer});
        // Sender approves owner to test transferFrom directly

        // await cem.approve(ownerAddress, amount);
        await expect(cem.approve(approvedWalletAddress, amount))
            .to.emit(cem, "Approval")
            .withArgs(senderAddress, approvedWalletAddress, amount);

        const approvedWalletAllowance = await cem.allowance(
            senderAddress,
            approvedWalletAddress
        );
        console.log({approvedWalletAllowance});
        expect(approvedWalletAllowance).to.equal(amount);

        // "Become" the owner wallet for future transactions with the cem contract
        cem.connect(ownerWalletObject);

        console.log("About to do the transfer");
        // Owner is sender
        await cem.transferFrom(senderAddress, recipientAddress, amount);
        // ---
        // End of block
        // ---

        // // "Become" the sender wallet for future transactions with the cem token
        // cem.connect(senderWalletObject);
        // // Sender approves contract
        // await cem.approve(contributionsAddress, amount);
        // const contractAllowance = await cem.allowance(
        //     senderAddress,
        //     contributionsAddress
        // );
        // console.log({contractAllowance});
        // // expect(allowance).to.equal(amount);

        // // "Become" the sender wallet for future transactions with the contributions contract
        // contributions.connect(senderWalletObject);

        // await contributions.contribute(senderAddress, nickname, amount);
        // currentNumberOfContributions += 1;

        // console.log(
        //     `${senderAddress} contributed ${amount} tokens to ${nickname}`
        // );

        // contributorAddresses = await contributions.listContributors(nickname);
        // console.log({contributorAddresses});
        // const contributedAmounts = await contributions.listAmounts(nickname);
        // console.log({contributedAmounts});

        // const contributionCount = await contributions.getContributionCount(
        //     nickname
        // );

        // expect(contributorAddresses.length).to.eq(currentNumberOfContributions);
        // expect(contributedAmounts.length).to.eq(currentNumberOfContributions);
        // expect(contributionCount).to.eq(currentNumberOfContributions);
        // console.log(`${currentNumberOfContributions} contributions as expected`);

        // const firstIndex = 0;
        // const firstContributorAddress = await contributions.getContributorAtIndex(
        //     nickname,
        //     firstIndex
        // );
        // expect(firstContributorAddress).to.eq(senderAddress);
        // const firstContributedAmount = await contributions.getAmountAtIndex(
        //     nickname,
        //     firstIndex
        // );
        // expect(firstContributedAmount).to.eq(amount);
    });
});
