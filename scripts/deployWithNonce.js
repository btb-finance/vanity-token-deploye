const hre = require("hardhat");
const { ethers } = require("hardhat");

async function getCurrentNonce(deployer) {
    return await ethers.provider.getTransactionCount(deployer.address);
}

async function main() {
    // Get the vanity address information
    const vanityAddresses = require('../vanity-addresses.json');
    const latestEntry = Object.values(vanityAddresses)[Object.values(vanityAddresses).length - 1];
    const targetAddress = latestEntry.address;
    
    console.log('\nNetwork:', hre.network.name);
    console.log('Target Contract Address:', targetAddress);

    const [deployer] = await ethers.getSigners();
    const currentNonce = await getCurrentNonce(deployer);
    
    console.log(`\nDeployer address: ${deployer.address}`);
    console.log(`Current nonce: ${currentNonce}`);
    
    // Deploy the contract
    console.log('\nDeploying BTBToken...');
    const BTBToken = await hre.ethers.getContractFactory("BTBToken");
    const token = await BTBToken.deploy();
    await token.deployed();
    
    const deployedAddress = token.address;
    console.log('\nDeployment Results:');
    console.log('='.repeat(50));
    console.log('Deployed to:', deployedAddress);
    
    // Log the explorer URLs based on the network
    const network = hre.network.name;
    const explorerUrl = network === "optimism_sepolia" 
        ? `https://sepolia-optimism.etherscan.io/address/${deployedAddress}`
        : `https://sepolia.basescan.org/address/${deployedAddress}`;
    
    console.log("View on explorer:", explorerUrl);
    
    // Save deployment info to a file
    const fs = require('fs');
    const path = require('path');
    const deploymentFile = path.join(__dirname, '..', 'deployments.json');
    
    try {
        let deployments = {};
        if (fs.existsSync(deploymentFile)) {
            deployments = JSON.parse(fs.readFileSync(deploymentFile));
        }
        
        if (!deployments[network]) {
            deployments[network] = [];
        }
        
        deployments[network].push({
            contractName: "BTBToken",
            address: deployedAddress,
            deployer: deployer.address,
            deploymentNonce: currentNonce,
            timestamp: new Date().toISOString(),
            transactionHash: token.deployTransaction?.hash || "N/A"
        });
        
        fs.writeFileSync(deploymentFile, JSON.stringify(deployments, null, 2));
        console.log('\nDeployment information saved to deployments.json');
    } catch (error) {
        console.error('Error saving deployment information:', error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
