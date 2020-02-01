import { BuidlerConfig, usePlugin } from "@nomiclabs/buidler/config";

usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@nomiclabs/buidler-solhint");

// Note: Don't actually put these values here. Get it from an
// env file that isn't in version control
const INFURA_API_KEY = "";
const RINKEBY_PRIVATE_KEY = "";
const ETHERSCAN_API_KEY = "";

const config: BuidlerConfig = {
  solc: {
    version: "0.6.2"
  },
  paths: {
    artifacts: "./artifacts"
  },
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [RINKEBY_PRIVATE_KEY]
    }
  },
  etherscan: {
    // The url for the Etherscan API you want to use.
    url: "https://api-rinkeby.etherscan.io/api",
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY
  }
};

export default config;
