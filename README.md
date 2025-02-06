# BTB Finance Token Deployer

Deploy your BTB Finance token with a custom vanity address across multiple chains using LayerZero.

## Quick Start

1. **Find Your Vanity Address**
```bash
# Run the vanity address finder (replace BB with your desired prefix/suffix)
node scripts/findVanityAddressParallel.js BB BB

# Example output:
# Found matching address!
# Contract Address: 0xBB...BB
# Deployer Address: 0x...
# Private Key: 0x...
```

2. **Set Up Environment**
```bash
# Copy the private key from step 1
cp .env.example .env

# Add your private key to .env
PRIVATE_KEY=your_private_key_from_step_1
```

3. **Deploy Contracts**
```bash
# Make script executable
chmod +x deploy-all.sh

# Deploy to all chains
./deploy-all.sh
```

## Deployment Details

The contract will be deployed to:
- Ethereum
- Polygon
- Arbitrum
- Optimism (Main Chain - where tokens are minted)
- Base
- BNB Chain
- Blast
- World
- Avalanche
- Zora

## Vanity Address Generator Options

```bash
node scripts/findVanityAddressParallel.js <prefix> <suffix> [caseSensitive]

# Examples:
# Find address starting and ending with 'BB' (case insensitive)
node scripts/findVanityAddressParallel.js BB BB

# Find address starting with 'Aa' and ending with 'Zz' (case sensitive)
node scripts/findVanityAddressParallel.js Aa Zz true
```

The script will:
1. Generate addresses until it finds one matching your pattern
2. Save the result to `vanity-addresses.json`
3. Display the private key to use for deployment

## Important Notes

- **Save Your Private Key**: After finding your vanity address, immediately save the private key
- **Funding**: Ensure your deployer address has enough native tokens on each chain
- **Main Chain**: Optimism is set as the main chain where the initial token supply is minted
- **Cross-Chain**: Use LayerZero's OFT features to transfer tokens between chains

## Contract Features

- Total Supply: 1 billion tokens
- Minting: Only on Optimism (main chain)
- Cross-Chain: LayerZero OFT integration for seamless transfers
- Vanity: Custom contract address matching your pattern

## Project Structure

```
├── contracts/          # Smart contracts
│   └── BTBFinance.sol # Main token contract
├── script/            # Deployment scripts
│   └── DeployAll.s.sol
├── scripts/           # Utility scripts
│   └── findVanityAddressParallel.js
└── deploy-all.sh      # Main deployment script
```

## Development

```bash
# Format code
pnpm prettier

# Type check
pnpm typecheck

# Run tests
pnpm test

# Build for production
pnpm build
```

## Troubleshooting

1. **Deployment Fails**
   - Ensure you have enough native tokens on each chain
   - Check RPC endpoints in `.env` file
   - Try deploying to one chain at a time

2. **Vanity Address Issues**
   - Try shorter patterns for faster results
   - Use case-insensitive mode for more matches
   - Check `vanity-addresses.json` for saved results

3. **Cross-Chain Transfers**
   - Wait for LayerZero confirmation
   - Ensure destination chain has gas

## Security Notes

- Always keep your private key secure and never share it
- Test the deployment on testnets first before deploying to mainnet
- Ensure you have enough native tokens on each chain for deployment
- Use TypeScript's type system to catch potential errors early

## Support

For issues or questions:
1. Check the troubleshooting section
2. Open an issue in this repository
