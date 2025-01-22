# Vanity Address Token Deployer

A tool for deploying ERC20 tokens with vanity addresses across multiple networks. Deploy your token with a custom address pattern on any EVM-compatible network.

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
