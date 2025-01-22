"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const ethers_1 = require("ethers");
const searchForAddress = async () => {
    let attempts = 0;
    while (true) {
        // Generate a new random wallet
        const wallet = ethers_1.ethers.Wallet.createRandom();
        // Calculate the contract address that would be deployed by this wallet
        const nonce = 0; // First transaction
        const address = ethers_1.ethers.utils.getContractAddress({
            from: wallet.address,
            nonce: nonce
        });
        attempts++;
        // Convert to checksum address for consistent comparison
        const checksumAddress = ethers_1.ethers.utils.getAddress(address);
        // Check if address matches our pattern (starts with BB and ends with BB)
        if (checksumAddress.slice(2, 4).toLowerCase() === 'bb' &&
            checksumAddress.slice(-2).toLowerCase() === 'bb') {
            worker_threads_1.parentPort?.postMessage({
                found: true,
                wallet: {
                    address: wallet.address,
                    privateKey: wallet.privateKey
                },
                address: checksumAddress,
                attempts: attempts
            });
            break;
        }
        // Report progress periodically
        if (attempts % 1000 === 0) {
            worker_threads_1.parentPort?.postMessage({
                found: false,
                attempts: 1000
            });
        }
    }
};
searchForAddress().catch(error => {
    console.error('Worker thread error:', error);
    process.exit(1);
});
