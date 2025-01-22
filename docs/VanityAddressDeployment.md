# Vanity Address Deployment Guide

This guide explains how to deploy smart contracts with vanity addresses across multiple EVM networks.

## Overview

The project includes several scripts that work together to:
1. Generate vanity addresses
2. Check nonces across networks
3. Deploy contracts with predictable addresses

## Scripts

### 1. findVanityAddressParallel.js
Generates vanity addresses using parallel processing for faster results.

```bash
node scripts/findVanityAddressParallel.js <prefix> <suffix> <caseSensitive>
```

Example:
```bash
node scripts/findVanityAddressParallel.js B B true
```

- **prefix**: Starting characters of the contract address
- **suffix**: Ending characters of the contract address
- **caseSensitive**: Whether to match case exactly (true/false)

### 2. checkNonce.js
Checks the nonce and balance of a deployer address across different networks.

```bash
node scripts/checkNonce.js
```

Features:
- Monitors nonce across multiple networks
- Shows balance in native currency
- Indicates if address is ready for deployment

### 3. deployWithNonce.js
Deploys contracts while managing nonce to achieve desired addresses.

```bash
npx hardhat run scripts/deployWithNonce.js --network <network_name>
```

Features:
- Tracks deployment nonce
- Saves deployment information
- Generates explorer links

## How Contract Addresses Are Generated

Contract addresses are deterministically generated using:
1. Deployer's address
2. Nonce (transaction count)
3. Contract bytecode

Formula: `keccak256(rlp([sender_address, nonce]))`

## Example Deployment

1. Generate vanity address:
```bash
node scripts/findVanityAddressParallel.js B B true
```

2. Check nonces:
```bash
node scripts/checkNonce.js
```

3. Deploy on multiple networks:
```bash
npx hardhat run scripts/deployWithNonce.js --network optimism_sepolia
npx hardhat run scripts/deployWithNonce.js --network base_sepolia
```

## Tips for Same Address Deployment

To deploy with the same address on multiple networks:
1. Use the same private key (deployer address)
2. Ensure same nonce on all networks
3. Use identical contract bytecode
4. Deploy in the same order on each network

## Output Files

1. **vanity-addresses.json**: Stores generated vanity addresses
```json
{
  "vanity_B_B": {
    "pattern": "B****B",
    "privateKey": "0x...",
    "address": "0x...",
    "description": "Vanity contract address",
    "createdAt": "2025-01-22"
  }
}
```

2. **deployments.json**: Tracks all deployments
```json
{
  "optimism_sepolia": [{
    "contractName": "BTBToken",
    "address": "0x...",
    "deployer": "0x...",
    "deploymentNonce": 1,
    "timestamp": "2025-01-22T..."
  }]
}
```

## Network Support

Currently supported networks:
- Optimism Sepolia
- Base Sepolia
- (Add more networks in hardhat.config.js)
