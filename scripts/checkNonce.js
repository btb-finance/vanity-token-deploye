const { ethers } = require('ethers');

// Network RPC URLs
const networks = {
    'Ethereum Sepolia': 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    'Optimism Sepolia': 'https://sepolia.optimism.io',
    'Base Sepolia': 'https://sepolia.base.org',
    'Polygon Mumbai': 'https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY',
    'BSC Testnet': 'https://data-seed-prebsc-1-s1.binance.org:8545',
    // Add more networks as needed
};

async function checkNonce(address) {
    console.log('\nChecking nonce for address:', address);
    console.log('='.repeat(50));

    for (const [networkName, rpcUrl] of Object.entries(networks)) {
        try {
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const nonce = await provider.getTransactionCount(address);
            const balance = await provider.getBalance(address);
            
            console.log(`\n${networkName}:`);
            console.log(`Nonce: ${nonce}`);
            console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
            
            if (nonce === 0) {
                console.log('✅ Ready for deployment (nonce is 0)');
            } else {
                console.log('❌ Not suitable for deployment (nonce > 0)');
            }
        } catch (error) {
            console.log(`\n${networkName}:`);
            console.log(`❌ Error checking network: ${error.message}`);
        }
    }
}

// Get deployer address from vanity-addresses.json
const vanityAddresses = require('../vanity-addresses.json');
const latestEntry = Object.values(vanityAddresses)[Object.values(vanityAddresses).length - 1];
const wallet = new ethers.Wallet(latestEntry.privateKey);
const deployerAddress = wallet.address;

console.log('Deployer Address:', deployerAddress);
console.log('Private Key:', latestEntry.privateKey);
console.log('Expected Contract Address:', latestEntry.address);

// Run the check
checkNonce(deployerAddress)
    .catch(console.error);
