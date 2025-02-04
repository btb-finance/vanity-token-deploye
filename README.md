# BTB Finance Token Deployer

A project for deploying the BTB Finance token with vanity address generation and cross-chain functionality using LayerZero.

## Features

- Vanity address generation for contract deployment
- Cross-chain token deployment on OP Sepolia and Base Sepolia
- Fixed supply of 1 billion tokens (minted only on OP Sepolia)
- LayerZero integration for cross-chain transfers

## Prerequisites

- Node.js
- pnpm
- Hardhat
- Forge (for contract development)

## Installation

```bash
# Install dependencies
pnpm install
```

## Configuration

1. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

2. Fill in the required environment variables:
```env
PRIVATE_KEY=your_private_key
OPTIMISTIC_API_KEY=your_optimism_api_key
BASESCAN_API_KEY=your_base_api_key
```

## Contract Deployment

1. Deploy to OP Sepolia (Main Chain):
```bash
pnpm hardhat deploy --network op-sepolia
```

2. Deploy to Base Sepolia:
```bash
pnpm hardhat deploy --network base-sepolia
```
£. Verify contracts:
```bash
npx hardhat verify-contracts --network base-sepolia

npx hardhat verify-contracts --network optimism-sepolia
```

## Setting Up Cross-Chain Communication

After deployment, set up peer information for cross-chain transfers:

1. Set peer on OP Sepolia:
```bash
pnpm hardhat run scripts/setPeer.ts --network op-sepolia
```

2. Set peer on Base Sepolia:
```bash
pnpm hardhat run scripts/setPeer.ts --network base-sepolia
```

## Sending Tokens Cross-Chain

Use the provided script to send tokens from OP Sepolia to Base Sepolia:

```bash
pnpm hardhat run scripts/sendTokensScript.ts --network op-sepolia
```

Check balances:
```bash
# Check OP Sepolia balance
pnpm hardhat run scripts/checkBalance.ts --network op-sepolia

# Check Base Sepolia balance
pnpm hardhat run scripts/checkBalanceBase.ts --network base-sepolia
```

## Vanity Address Generation

Generate a vanity address for contract deployment:

```bash
node scripts/findVanityAddressParallel.js
```

This will search for an address starting with your desired prefix.

## Known Issues and TODOs

1. Contract Verification
   - Currently, verification on block explorers (Etherscan) is failing
   - Issue: Constructor argument mismatch
   - Workaround: Contracts are verified on Sourcify

2. Test Script Improvements
   - Add more comprehensive test coverage
   - Include cross-chain transfer tests
   - Add gas optimization tests

## Testing

Run the test suite:

```bash
# Run Hardhat tests
pnpm hardhat test

# Run Forge tests
forge test
```

## Contract Addresses

- OP Sepolia: `0xB1ca5c3c195EB86956e369011f65B3A7B6E444BB`
- Base Sepolia: `0xB1ca5c3c195EB86956e369011f65B3A7B6E444BB`

## License

MIT
