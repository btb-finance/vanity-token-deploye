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

## Deployment and Verification Guide 🚀

### 1. Deployment Commands

Deploy to Base Sepolia:
```bash
npx hardhat run scripts/deployWithNonce.js --network base-sepolia
```

Deploy to OP Sepolia:
```bash
npx hardhat run scripts/deployWithNonce.js --network optimism-sepolia
```

### 2. Contract Verification Commands

Verify on Base Sepolia:
```bash
npx hardhat verify --network base-sepolia CONTRACT_ADDRESS \
    "btb" \
    "btb" \
    "0x6EDCE65403992e310A62460808c4b910D972f10f" \
    "YOUR_DEPLOYER_ADDRESS" \
    "1000000000000000000000000000" \
    "11155420"
```

Verify on OP Sepolia:
```bash
npx hardhat verify --network optimism-sepolia CONTRACT_ADDRESS \
    "btb" \
    "btb" \
    "0x6EDCE65403992e310A62460808c4b910D972f10f" \
    "YOUR_DEPLOYER_ADDRESS" \
    "1000000000000000000000000000" \
    "11155420"
```

### Parameters Explained:
- `CONTRACT_ADDRESS`: The deployed contract address
- `"btb"`: Token name
- `"btb"`: Token symbol
- `"0x6EDCE65403992e310A62460808c4b910D972f10f"`: LayerZero endpoint
- `"YOUR_DEPLOYER_ADDRESS"`: Your deployer wallet address
- `"1000000000000000000000000000"`: Max supply (1 billion tokens with 18 decimals)
- `"11155420"`: Main chain ID (OP Sepolia)

### Example with Real Values:

1. Base Sepolia Verification:
```bash
npx hardhat verify --network base-sepolia 0xAD72A833Cd7CaF39f91cdb02cDaCA66DCaF6f518 "btb" "btb" "0x6EDCE65403992e310A62460808c4b910D972f10f" "0x629455807f7AaacC41cBd486C635C1208993f3ee" "1000000000000000000000000000" "11155420"
```

2. OP Sepolia Verification:
```bash
npx hardhat verify --network optimism-sepolia 0x69e48964db9d320157009092a65632f6a4a2C38d "btb" "btb" "0x6EDCE65403992e310A62460808c4b910D972f10f" "0x629455807f7AaacC41cBd486C635C1208993f3ee" "1000000000000000000000000000" "11155420"
```

### Important Notes:
1. Make sure you have enough native tokens (ETH) on both networks for deployment and verification
2. Set your private key in the `.env` file
3. Set the API keys in the `.env` file:
   ```
   BASE_API_KEY=your_base_api_key
   OPTIMISM_API_KEY=your_optimism_api_key
   ```
4. The network names in the commands must match exactly: `base-sepolia` and `optimism-sepolia`

### Deployed Contract Addresses:
- Base Sepolia: `0xAD72A833Cd7CaF39f91cdb02cDaCA66DCaF6f518`
- OP Sepolia: `0x69e48964db9d320157009092a65632f6a4a2C38d`

### Fixed Issues 🛠️
- Fixed network deployment confusion between Base and OP Sepolia networks
- Improved gas estimation and transaction handling
- Enhanced nonce management across different networks

## BTB Token Deployment Details 🚀

### Deployed Contracts

The BTB Token has been successfully deployed on multiple networks:

1. **Base Sepolia**
   - Contract Address: `0xBB2E2c8F0e2fec57e0D60F74d8a6D0FE41D8b00B`
   - Network: Base Sepolia Testnet (Chain ID: 84532)
   - LayerZero Endpoint: `0x6EDCE65403992e310A62460808c4b910D972f10f`

2. **OP Sepolia**
   - Contract Address: `0xCd26f595Dfc49AAB64ABDD5d75742e7506F5d1c5`
   - Network: OP Sepolia Testnet (Chain ID: 11155420)
   - LayerZero Endpoint: `0x6EDCE65403992e310A62460808c4b910D972f10f`

### Token Details
- Name: "btb"
- Symbol: "btb"
- Maximum Supply: 1,000,000,000 tokens
- Decimals: 18

### How to Deploy

1. **Setup Environment**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd vanity-token-deployer

   # Install dependencies
   npm install

   # Create .env file with your private key
   echo "PRIVATE_KEY=your_private_key_here" > .env
   ```

2. **Configure Networks**
   The project is already configured for Base Sepolia and OP Sepolia in `hardhat.config.js`. Make sure you have test ETH on these networks.

3. **Deploy to Base Sepolia**
   ```bash
   # Update the deployment script parameters in scripts/deployWithNonce.js
   # Then run:
   npx hardhat run scripts/deployWithNonce.js --network base_sepolia
   ```

4. **Deploy to OP Sepolia**
   ```bash
   # Update the deployment script parameters in scripts/deployWithNonce.js
   # Then run:
   npx hardhat run scripts/deployWithNonce.js --network optimism_sepolia
   ```

### Contract Verification
You can verify the contracts on their respective block explorers:
- Base Sepolia: https://sepolia.basescan.org/address/0xBB2E2c8F0e2fec57e0D60F74d8a6D0FE41D8b00B
- OP Sepolia: https://sepolia-optimism.etherscan.io/address/0xCd26f595Dfc49AAB64ABDD5d75742e7506F5d1c5

### Interacting with the Contracts

You can interact with the deployed contracts using:

1. **Block Explorers**
   - Visit the contract addresses on the respective block explorers
   - Use the "Write Contract" section to interact with contract functions

2. **Hardhat Console**
   ```javascript
   // Example interaction using hardhat console
   npx hardhat console --network base_sepolia
   
   // Get contract instance
   const BTBToken = await ethers.getContractFactory("BTBToken")
   const token = await BTBToken.attach("0xBB2E2c8F0e2fec57e0D60F74d8a6D0FE41D8b00B")
   
   // Check balance
   const balance = await token.balanceOf("your_address_here")
   ```

3. **Web3.js/Ethers.js**
   ```javascript
   // Example using ethers.js
   const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_URL")
   const signer = new ethers.Wallet("YOUR_PRIVATE_KEY", provider)
   const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer)
   ```

### Gas Settings

The deployment uses the following gas settings for optimal deployment:
- Gas Limit: 5,000,000
- Max Fee Per Gas: 1.5 gwei
- Max Priority Fee: 1.5 gwei

These settings are configured in the deployment script and can be adjusted if needed.

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
