#!/bin/bash

# Read private key from .env file
PRIVATE_KEY=$(grep PRIVATE_KEY .env | cut -d '=' -f2)

# Check if private key is found
if [ -z "$PRIVATE_KEY" ]; then
    echo "Error: PRIVATE_KEY not found in .env file"
    exit 1
fi

# Export private key with 0x prefix
export PRIVATE_KEY

# Read RPC URLs from rpc-config.json
ETHEREUM_RPC=$(jq -r '.ethereum[0]' rpc-config.json)
POLYGON_RPC=$(jq -r '.polygon[0]' rpc-config.json)
ARBITRUM_RPC=$(jq -r '.arbitrum[0]' rpc-config.json)
OPTIMISM_RPC=$(jq -r '.optimism[0]' rpc-config.json)
BASE_RPC=$(jq -r '.base[0]' rpc-config.json)
BNB_RPC=$(jq -r '.bnb[0]' rpc-config.json)
BLAST_RPC=$(jq -r '.blast[0]' rpc-config.json)
WORLD_RPC=$(jq -r '.world[0]' rpc-config.json)
AVALANCHE_RPC=$(jq -r '.avalanche[0]' rpc-config.json)
ZORA_RPC=$(jq -r '.zora[0]' rpc-config.json)

# Export RPC URLs
export ETH_RPC_URL=$ETHEREUM_RPC
export POLYGON_RPC_URL=$POLYGON_RPC
export ARBITRUM_RPC_URL=$ARBITRUM_RPC
export OPTIMISM_RPC_URL=$OPTIMISM_RPC
export BASE_RPC_URL=$BASE_RPC
export BSC_RPC_URL=$BNB_RPC
export BLAST_RPC_URL=$BLAST_RPC
export WORLD_RPC_URL=$WORLD_RPC
export AVALANCHE_RPC_URL=$AVALANCHE_RPC
export ZORA_RPC_URL=$ZORA_RPC

# Print environment variables
echo "Environment variables set:"
echo "ETH_RPC_URL=$ETH_RPC_URL"
echo "POLYGON_RPC_URL=$POLYGON_RPC_URL"
echo "ARBITRUM_RPC_URL=$ARBITRUM_RPC_URL"
echo "OPTIMISM_RPC_URL=$OPTIMISM_RPC_URL"
echo "BASE_RPC_URL=$BASE_RPC_URL"
echo "BSC_RPC_URL=$BSC_RPC_URL"
echo "BLAST_RPC_URL=$BLAST_RPC_URL"
echo "WORLD_RPC_URL=$WORLD_RPC_URL"
echo "AVALANCHE_RPC_URL=$AVALANCHE_RPC_URL"
echo "ZORA_RPC_URL=$ZORA_RPC_URL"
echo "Private key is set (from .env file)"
echo ""
echo "Ready to deploy! Run:"
echo "./deploy-all.sh"
