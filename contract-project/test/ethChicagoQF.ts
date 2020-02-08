import {waffle} from "@nomiclabs/buidler";
import chai from "chai";
import {deployContract, solidity} from "ethereum-waffle";

import ContributionsArtifact from "../artifacts/EthChicagoQF.json";
import {EthChicagoQF} from "../typechain/EthChicagoQF";
import CEMTokenArtifact from "../artifacts/CEMToken.json";
import {CEMToken} from "../typechain/CEMToken";

chai.use(solidity);
const {expect} = chai;

describe.only("EthChicagoQF contract", () => {
    const provider = waffle.provider;

    let [
        adminWalletObject,
        projectWalletObject,
        backerWalletObject,
        approvedWalletObject
    ] = provider.getWallets();

    const {address: adminAddress} = adminWalletObject;
    const {address: backerAddress} = backerWalletObject;
    const {address: projectAddress} = projectWalletObject;
    const {address: approvedWalletAddress} = approvedWalletObject;
    console.log({adminAddress});
    console.log({backerAddress});
    console.log({projectAddress});
    console.log({approvedWalletAddress});

    let ethChicagoQFContract: EthChicagoQF;
    let ethChicagoQFContractAsBacker: EthChicagoQF;

    let cemTokenContract: CEMToken;
    let cemTokenContractAsBacker: CEMToken;
    let cemTokenContractAsApprovedSpender: CEMToken;

    // TODO: Use an address type rather than the more generic string
    let contributionsAddress: string;

    beforeEach(async () => {
        ethChicagoQFContract = (await deployContract(
            adminWalletObject,
            ContributionsArtifact
        )) as EthChicagoQF;

        contributionsAddress = ethChicagoQFContract.address;
        console.log({contributionsAddress});

        // Get a reference to the EthChicagoQF contract where the backer is
        // always a "meetup attendee"
        ethChicagoQFContractAsBacker = ethChicagoQFContract.connect(
            backerWalletObject
        );

        const initialSupply = 100;

        // Note: Initially the backer of the deploy tx has all of the initial supply
        cemTokenContract = (await deployContract(
            adminWalletObject,
            CEMTokenArtifact,
            [initialSupply]
        )) as CEMToken;

        // Get a reference to the CEMToken contract where the backer is
        // always a "meetup attendee"
        cemTokenContractAsBacker = cemTokenContract.connect(backerWalletObject);

        cemTokenContractAsApprovedSpender = cemTokenContract.connect(
            approvedWalletObject
        );

        const {address: cemTokenContractAddress} = cemTokenContract;
        console.log({cemTokenContractAddress});

        // Double-check that we set up:
        // (A) the initial token supply
        // and
        // (B) the balance of the admin account correctly
        const totalSupply = await cemTokenContract.totalSupply();
        expect(totalSupply).to.equal(initialSupply);
        const adminBalance = await cemTokenContract.balanceOf(adminAddress);
        expect(adminBalance).to.equal(initialSupply);

        // Pick the token that will be tracked for QF/CLR purposes
        await ethChicagoQFContract.setToken(cemTokenContractAddress);

        // Give the backer account some tokens to contribute to projects
        const backerInitialAmount = 20;
        await cemTokenContract.transfer(backerAddress, backerInitialAmount);
        const backerBalance = await cemTokenContract.balanceOf(backerAddress);
        expect(backerBalance).to.equal(backerInitialAmount);
        console.log({backerBalance});
    });

    it("should be able to spend approved CEMToken", async () => {
        const amount = 10;

        // Just using this to test balance error
        // Sender approves other wallet to test transferFrom directly

        await expect(
            cemTokenContractAsBacker.approve(approvedWalletAddress, amount)
        )
            .to.emit(cemTokenContractAsBacker, "Approval")
            .withArgs(backerAddress, approvedWalletAddress, amount);

        const approvedWalletAllowance = await cemTokenContractAsBacker.allowance(
            backerAddress,
            approvedWalletAddress
        );
        console.log({approvedWalletAllowance});
        expect(approvedWalletAllowance).to.equal(amount);

        console.log("About to do the transfer");
        // Owner is backer
        await cemTokenContractAsApprovedSpender.transferFrom(
            backerAddress,
            projectAddress,
            amount
        );
    });

    // Note: Real unit tests should be smaller than this
    // and the shared parts should move into a beforeEach hook
    // Just wrote this literally as quickly as possible
    it("should be able to back a project", async () => {
        const amount = 10;
        let currentNumberOfContributions = 0;

        const nickname = "project-one";

        // As admin
        await ethChicagoQFContract.addProject(projectAddress, nickname);
        console.log(`Added project ${projectAddress}`);

        // Reading public data, backer doesn't matter because it isn't a tx
        let contributorAddresses = await ethChicagoQFContract.listContributors(
            nickname
        );
        expect(contributorAddresses.length).to.eq(0);

        // Sender approves contract
        await cemTokenContractAsBacker.approve(contributionsAddress, amount);
        const contractAllowance = await cemTokenContract.allowance(
            backerAddress,
            contributionsAddress
        );
        console.log({contractAllowance});
        // expect(allowance).to.equal(amount);

        await ethChicagoQFContractAsBacker.contribute(
            backerAddress,
            nickname,
            amount
        );

        const projectBalance = await cemTokenContract.balanceOf(projectAddress);
        console.log({projectBalance});
        expect(projectBalance).to.equal(amount);

        currentNumberOfContributions += 1;

        console.log(
            `${backerAddress} contributed ${amount} tokens to ${nickname}`
        );

        contributorAddresses = await ethChicagoQFContract.listContributors(
            nickname
        );
        console.log({contributorAddresses});
        const contributedAmounts = await ethChicagoQFContract.listAmounts(
            nickname
        );
        console.log({contributedAmounts});

        const contributionCount = await ethChicagoQFContract.getContributionCount(
            nickname
        );

        expect(contributorAddresses.length).to.eq(currentNumberOfContributions);
        expect(contributedAmounts.length).to.eq(currentNumberOfContributions);
        expect(contributionCount).to.eq(currentNumberOfContributions);
        console.log(
            `${currentNumberOfContributions} contributions as expected`
        );

        const firstIndex = 0;
        const firstContributorAddress = await ethChicagoQFContract.getContributorAtIndex(
            nickname,
            firstIndex
        );
        expect(firstContributorAddress).to.eq(backerAddress);
        const firstContributedAmount = await ethChicagoQFContract.getAmountAtIndex(
            nickname,
            firstIndex
        );
        expect(firstContributedAmount).to.eq(amount);
    });
});
