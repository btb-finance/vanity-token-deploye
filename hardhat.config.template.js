require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");

// Your vanity address private key
const VANITY_PRIVATE_KEY = "YOUR_PRIVATE_KEY"; // Replace with your vanity address private key

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    // Mainnets
    ethereum: {
      url: "https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY",
      accounts: [VANITY_PRIVATE_KEY],
      chainId: 1
    },
    optimism: {
      url: "https://mainnet.optimism.io",
      accounts: [VANITY_PRIVATE_KEY],
      chainId: 10
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [VANITY_PRIVATE_KEY],
      chainId: 8453
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: [VANITY_PRIVATE_KEY],
      chainId: 42161
    },

    // Testnets
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY",
      accounts: [VANITY_PRIVATE_KEY],
      chainId: 11155111
    },
    optimism_sepolia: {
      url: "https://sepolia.optimism.io",
      accounts: [VANITY_PRIVATE_KEY],
      chainId: 11155420
    },
    base_sepolia: {
      url: "https://sepolia.base.org",
      accounts: [VANITY_PRIVATE_KEY],
      chainId: 84532
    },
    arbitrum_sepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: [VANITY_PRIVATE_KEY],
      chainId: 421614
    }
  },
  etherscan: {
    apiKey: {
      // Mainnet API Keys
      mainnet: "YOUR_ETHERSCAN_API_KEY",
      optimisticEthereum: "YOUR_OPTIMISM_API_KEY",
      base: "YOUR_BASESCAN_API_KEY",
      arbitrumOne: "YOUR_ARBISCAN_API_KEY",
      
      // Testnet API Keys
      sepolia: "YOUR_ETHERSCAN_API_KEY",
      optimisticSepolia: "YOUR_OPTIMISM_API_KEY",
      baseSepolia: "YOUR_BASESCAN_API_KEY",
      arbitrumSepolia: "YOUR_ARBISCAN_API_KEY"
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  }
};
