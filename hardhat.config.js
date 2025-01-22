require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");

module.exports = {
  solidity: "0.8.20",
  networks: {
    base_sepolia: {
      url: "https://sepolia.base.org",
      accounts: ["0xaffd9ef1da30f34e7da1009fffb5a342b845ad1b3e61061d2775b8e718ff227e"],
      chainId: 84532,
      gasMultiplier: 8,
      timeout: 300000
    },
    optimism_sepolia: {
      url: "https://sepolia.optimism.io",
      accounts: ["0xaffd9ef1da30f34e7da1009fffb5a342b845ad1b3e61061d2775b8e718ff227e"],
      chainId: 11155420,
      gasMultiplier: 8,
      timeout: 300000
    }
  }
};
