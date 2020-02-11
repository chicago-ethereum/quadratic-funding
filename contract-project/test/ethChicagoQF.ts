import {waffle} from "@nomiclabs/buidler";
import chai from "chai";
import {deployContract, solidity} from "ethereum-waffle";

import ContributionsArtifact from "../artifacts/EthChicagoQF.json";
import {EthChicagoQF} from "../typechain/EthChicagoQF";
import CEMTokenArtifact from "../artifacts/CEMToken.json";
import {CEMToken} from "../typechain/CEMToken";

chai.use(solidity);
const {expect} = chai;

describe("EthChicagoQF contract", () => {
    const provider = waffle.provider;

    let [
        adminWalletObject,
        projectWalletObject,
        backerWalletObject,
        approvedWalletObject,
        projectWalletTwoObject,
        projectWalletThreeObject
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

    // TODO: Use an address type rather than the more generic string
    let ethChicagoQFContractAddress: string;

    beforeEach(async () => {
        ethChicagoQFContract = (await deployContract(
            adminWalletObject,
            ContributionsArtifact
        )) as EthChicagoQF;

        ethChicagoQFContractAddress = ethChicagoQFContract.address;
        console.log({ethChicagoQFContractAddress});

        // Get a reference to the EthChicagoQF contract where the backer is
        // always a "meetup attendee"
        ethChicagoQFContractAsBacker = ethChicagoQFContract.connect(
            backerWalletObject
        );

        const initialSupply = "1000000000000000000";

        // Note: Initially the backer of the deploy tx has all of the initial supply
        cemTokenContract = (await deployContract(
            adminWalletObject,
            CEMTokenArtifact,
            [initialSupply]
        )) as CEMToken;

        // Get a reference to the CEMToken contract where the backer is
        // always a "meetup attendee"
        cemTokenContractAsBacker = cemTokenContract.connect(backerWalletObject);

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
        const backerInitialAmount = "20000000000000000";
        await cemTokenContract.transfer(backerAddress, backerInitialAmount);
        const backerBalance = await cemTokenContract.balanceOf(backerAddress);
        expect(backerBalance).to.equal(backerInitialAmount);
        console.log({backerBalance});
    });

    it("list projects", async () => {
        const multipleNicknames = [
            "project-one",
            "project-two",
            "project-three"
        ];

        const {address: projectTwoAddress} = projectWalletTwoObject;
        const {address: projectThreeAddress} = projectWalletThreeObject;

        const multipleProjectAddresses = [
            projectAddress,
            projectTwoAddress,
            projectThreeAddress
        ];

        const numProjects = multipleNicknames.length;

        let currentProjectNickname;
        let currentProjectAddress;

        for (let index = 0; index++; index < numProjects) {
            currentProjectNickname = multipleNicknames[index];
            currentProjectAddress = multipleProjectAddresses[index];
            // As admin
            await ethChicagoQFContract.addProject(
                currentProjectAddress,
                currentProjectNickname
            );
            console.log(
                `Added project ${currentProjectAddress} with nickname ${currentProjectNickname}`
            );
        }
        const projectNicknameFromContract = await ethChicagoQFContract.listProjects();
        console.log({projectNicknameFromContract});

        const projectCount = await ethChicagoQFContract.getProjectCount();

        expect(projectNicknameFromContract.length).to.eq(numProjects);
        expect(projectCount).to.eq(numProjects);

        console.log(`${projectCount} projects as expected`);

        const firstIndex = 0;
        const firstProjectNickname = await ethChicagoQFContract.getProjectAtIndex(
            firstIndex
        );
        expect(firstProjectNickname).to.eq(multipleNicknames[0]);
    });

    describe("back a project", () => {
        let nickname: string = "";
        let backerAddresses;

        beforeEach(async () => {
            nickname = "project-one";

            // As admin
            await ethChicagoQFContract.addProject(projectAddress, nickname);
            console.log(`Added project ${projectAddress}`);

            // Reading public data, backer doesn't matter because it isn't a tx
            let backerAddresses = await ethChicagoQFContract.listBackers(
                nickname
            );
            expect(backerAddresses.length).to.eq(0);
        });

        it("arrays handling internal accounting should behave properly", async () => {
            const amount = 10;
            let currentNumberOfContributions = 0;

            // Sender approves contract
            await cemTokenContractAsBacker.approve(
                ethChicagoQFContractAddress,
                amount
            );

            await ethChicagoQFContractAsBacker.contribute(nickname, amount);

            currentNumberOfContributions += 1;

            console.log(
                `${backerAddress} contributed ${amount} tokens to ${nickname}`
            );

            backerAddresses = await ethChicagoQFContract.listBackers(nickname);
            console.log({backerAddresses});

            const contributedAmounts = await ethChicagoQFContract.listAmounts(
                nickname
            );
            console.log({contributedAmounts});

            const contributionCount = await ethChicagoQFContract.getContributionCount(
                nickname
            );

            expect(backerAddresses.length).to.eq(currentNumberOfContributions);
            expect(contributedAmounts.length).to.eq(
                currentNumberOfContributions
            );
            expect(contributionCount).to.eq(currentNumberOfContributions);

            console.log(
                `${currentNumberOfContributions} contributions as expected`
            );

            const firstIndex = 0;
            const firstBackerAddress = await ethChicagoQFContract.getBackerAtIndex(
                nickname,
                firstIndex
            );
            expect(firstBackerAddress).to.eq(backerAddress);
            const firstContributedAmount = await ethChicagoQFContract.getAmountAtIndex(
                nickname,
                firstIndex
            );
            expect(firstContributedAmount).to.eq(amount);
        });

        it("should be able to back a project", async () => {
            const amount = 10;
            let currentNumberOfContributions = 0;

            // Sender approves contract
            await cemTokenContractAsBacker.approve(
                ethChicagoQFContractAddress,
                amount
            );
            const contractAllowance = await cemTokenContract.allowance(
                backerAddress,
                ethChicagoQFContractAddress
            );
            console.log({contractAllowance});
            expect(contractAllowance).to.equal(amount);

            await ethChicagoQFContractAsBacker.contribute(nickname, amount);

            const projectBalance = await cemTokenContract.balanceOf(
                projectAddress
            );
            console.log({projectBalance});
            expect(projectBalance).to.equal(amount);

            currentNumberOfContributions += 1;

            console.log(
                `${backerAddress} contributed ${amount} tokens to ${nickname}`
            );
        });

        it("should be able to back a project with a large amount", async () => {
            const largeAmount = "1000000000000000";
            let currentNumberOfContributions = 0;

            // Sender approves contract
            await cemTokenContractAsBacker.approve(
                ethChicagoQFContractAddress,
                largeAmount
            );
            const contractAllowance = await cemTokenContract.allowance(
                backerAddress,
                ethChicagoQFContractAddress
            );
            console.log({contractAllowance});
            expect(contractAllowance).to.equal(largeAmount);

            await ethChicagoQFContractAsBacker.contribute(
                nickname,
                largeAmount
            );

            const projectBalance = await cemTokenContract.balanceOf(
                projectAddress
            );
            console.log({projectBalance});
            expect(projectBalance).to.equal(largeAmount);

            console.log(
                `${backerAddress} contributed ${largeAmount} tokens to ${nickname}`
            );

            const firstIndex = 0;
            const firstContributedAmount = await ethChicagoQFContract.getAmountAtIndex(
                nickname,
                firstIndex
            );
            expect(firstContributedAmount).to.eq(largeAmount);
        });
    });
});
