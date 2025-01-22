require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    "optimism-sepolia": {
      url: "https://sepolia.optimism.io",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155420,
      gasPrice: 1000000000, // 1 gwei
      gas: 10000000, // 10M
      blockGasLimit: 15000000,
      gasMultiplier: 1.2
    },
    "base-sepolia": {
      url: "https://base-sepolia-rpc.publicnode.com",
      accounts: [process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000"],
      chainId: 84532,
      gasMultiplier: 1.2
    }
  },
  etherscan: {
    apiKey: {
      "base-sepolia": process.env.BASE_API_KEY,
      "optimism-sepolia": process.env.OPTIMISM_API_KEY
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      },
      {
        network: "optimism-sepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimism.etherscan.io/"
        }
      }
    ]
  }
};
