#!/bin/bash

# Source environment variables
source ./setup-env.sh

# Function to deploy to a specific network
deploy_to_network() {
    local network=$1
    local rpc_url=$2
    
    echo "Deploying to ${network}..."
    echo "Deploying contract to ${network} using RPC: ${rpc_url}"
    
    # Try deployment
    forge script script/DeployAll.s.sol --rpc-url "${rpc_url}" --broadcast --verify -vvvv || {
        echo "Deployment to ${network} failed"
        return 1
    }
    
    # Add delay between deployments to avoid rate limiting
    sleep 10
}

# Deploy to each network one by one
deploy_to_network "ethereum" "$ETH_RPC_URL"
deploy_to_network "polygon" "$POLYGON_RPC_URL"
deploy_to_network "arbitrum" "$ARBITRUM_RPC_URL"
deploy_to_network "optimism" "$OPTIMISM_RPC_URL"
deploy_to_network "base" "$BASE_RPC_URL"
deploy_to_network "bnb" "$BSC_RPC_URL"
deploy_to_network "blast" "$BLAST_RPC_URL"
deploy_to_network "world" "$WORLD_RPC_URL"
deploy_to_network "avalanche" "$AVALANCHE_RPC_URL"
deploy_to_network "zora" "$ZORA_RPC_URL"
