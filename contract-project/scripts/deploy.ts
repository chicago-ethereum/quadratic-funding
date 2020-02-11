import {ethers} from "@nomiclabs/buidler";

async function main() {
    const cemTokenFactory = await ethers.getContract("CEMToken");

    // 10 ^ 18 = 1000000000000000000
    // 1000 * 10 ^ 18 = 1000000000000000000000
    // 1000 * 10 ^ 18 as a string "1000000000000000000000"
    let cemTokenContract = await cemTokenFactory.deploy(
        "1000000000000000000000"
    );

    const {address: cemTokenContractAddress} = cemTokenContract;

    // The address the Contract WILL have once mined
    console.log(`cemTokenContract address is ${cemTokenContractAddress}`);

    // The transaction that was sent to the network to deploy the Contract
    console.log(
        `cemTokenContract.deployTransaction.hash is ${cemTokenContract.deployTransaction.hash}`
    );

    // The contract is NOT deployed yet; we must wait until it is mined
    await cemTokenContract.deployed();

    const ethChicagoQFFactory = await ethers.getContract("EthChicagoQF");
    let ethChicagoQFContract = await ethChicagoQFFactory.deploy();

    // The address the Contract WILL have once mined
    console.log(
        `ethChicagoQFContract address is ${ethChicagoQFContract.address}`
    );

    // The transaction that was sent to the network to deploy the Contract
    console.log(
        `ethChicagoQFContract.deployTransaction.hash is ${ethChicagoQFContract.deployTransaction.hash}`
    );

    // The contract is NOT deployed yet; we must wait until it is mined
    await ethChicagoQFContract.deployed();

    // Set the first token to be the contract we just deployed
    await ethChicagoQFContract.setToken(cemTokenContractAddress);
}

async function wrapper() {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

wrapper();
