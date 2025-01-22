# Vanity Token Deployer

> 🎯 Deploy ERC20 tokens with custom vanity addresses across multiple EVM networks. Achieve the same contract address on every chain!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?logo=ethereum&logoColor=white)](https://ethereum.org/)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-FFDB1C.svg)](https://hardhat.org/)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4E5EE4)](https://www.openzeppelin.com/)

## About 📚

**Vanity Token Deployer** is a powerful toolkit for deploying smart contracts with customizable vanity addresses across multiple EVM-compatible networks. Whether you're launching a token on Ethereum, Optimism, Base, or any other EVM chain, this tool ensures your contract gets the same memorable address everywhere.

### Key Features 🔑

- 🎯 **Custom Vanity Addresses**: Deploy contracts with addresses matching your desired pattern
- 🔄 **Cross-Chain Consistency**: Same contract address across different networks
- ⚡ **Parallel Processing**: Fast vanity address generation using multi-threading
- 🔍 **Nonce Management**: Automatic handling of deployment nonces
- 📊 **Deployment Tracking**: Keep track of all your deployments across networks
- 🔒 **Security Focused**: Built-in safety checks and best practices

### Perfect For 🎯

- 🏢 **Projects** deploying tokens across multiple chains
- 🎨 **Brands** wanting memorable contract addresses
- 🛠️ **Developers** needing predictable contract deployment
- 🔄 **DeFi protocols** requiring same addresses across networks

---

## Features

- Deploy tokens with custom vanity addresses
- Multi-network deployment support
- Same contract address across different networks
- Parallel processing for fast vanity address generation
- Automatic nonce management
- Deployment tracking and verification

## Documentation

- [Vanity Address Deployment Guide](docs/VanityAddressDeployment.md)
- [Script Documentation](docs/ScriptDocumentation.md)

## Getting Started

1. Create your token contract in `contracts/` directory:
```solidity
// Example structure
contract YourToken is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10**decimals);
    }
}
```

2. Install dependencies:
```bash
npm install
```

3. Configure networks in hardhat.config.js:
```javascript
{
  networks: {
    network_name: {
      url: "RPC_URL",
      accounts: ["PRIVATE_KEY"],
      chainId: CHAIN_ID
    }
  }
}
```

4. Deploy with vanity address:
```bash
# Generate vanity address (e.g., for address starting and ending with 'B')
node scripts/findVanityAddressParallel.js B B true

# Check nonces
node scripts/checkNonce.js

# Deploy
npx hardhat run scripts/deployWithNonce.js --network <network_name>
```

## Scripts

- `findVanityAddressParallel.js`: Generate vanity addresses
- `checkNonce.js`: Check deployer nonce across networks
- `deployWithNonce.js`: Deploy with nonce management
- `deploy.js`: Standard deployment script

For detailed information about each script, see the [Script Documentation](docs/ScriptDocumentation.md).

## Example Deployments

Our test deployments achieved the same address on multiple networks:
- Optimism Sepolia: [0x782eDFDEa8dFF5f699A9911811cd0c02656868A6](https://sepolia-optimism.etherscan.io/address/0x782eDFDEa8dFF5f699A9911811cd0c02656868A6)
- Base Sepolia: [0x782eDFDEa8dFF5f699A9911811cd0c02656868A6](https://sepolia.basescan.org/address/0x782eDFDEa8dFF5f699A9911811cd0c02656868A6)

## Important Notes

1. **Contract Customization**
   - Replace the example token contract with your own implementation
   - Customize token parameters in your contract constructor
   - Add any additional features your token needs

2. **Security**
   - Always audit your token contract before deployment
   - Keep private keys secure and never commit them to the repository
   - Test thoroughly on testnets before mainnet deployment

3. **Network Support**
   - Works on any EVM-compatible network
   - Add custom networks in hardhat.config.js
   - Ensure RPC endpoints are reliable

For more detailed information about deploying with vanity addresses, check the [Vanity Address Deployment Guide](docs/VanityAddressDeployment.md).

## Credits

### Developed by BTB Finance Team

<div align="center">
   <a href="https://www.btb.finance" target="_blank">
      <img src="https://img.shields.io/badge/BTB_Finance-Website-blue?style=for-the-badge&logo=ethereum" alt="BTB Finance Website" />
   </a>
   <a href="https://twitter.com/btb_finance" target="_blank">
      <img src="https://img.shields.io/badge/Follow-btb__finance-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Follow on Twitter" />
   </a>
</div>

<div align="center">
   <p>
      Built with 💙 by the <a href="https://www.btb.finance">BTB Finance</a> team.<br>
      Making DeFi deployment easier, one address at a time.
   </p>
</div>

---

<div align="center">
   <sub>
      If you find this tool useful, follow us on <a href="https://twitter.com/btb_finance">Twitter</a> for more updates!
   </sub>
</div>
