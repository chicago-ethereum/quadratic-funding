import {BuidlerConfig, usePlugin} from "@nomiclabs/buidler/config";

require("dotenv-flow").config();

usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@nomiclabs/buidler-solhint");
usePlugin("@nomiclabs/buidler-etherscan");

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

let accounts = [""];
if (RINKEBY_PRIVATE_KEY) {
    accounts = [RINKEBY_PRIVATE_KEY];
}

let etherscanAPIKeyToUse = "";
if (ETHERSCAN_API_KEY) {
    etherscanAPIKeyToUse = ETHERSCAN_API_KEY;
}

const config: BuidlerConfig = {
    solc: {
        version: "0.5.15"
    },
    paths: {
        artifacts: "./artifacts"
    },
    defaultNetwork: "buidlerevm",
    networks: {
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accounts
        }
    },
    etherscan: {
        // The url for the Etherscan API you want to use.
        url: "https://api-rinkeby.etherscan.io/api",
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: etherscanAPIKeyToUse
    }
};

export default config;
