"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
async function findVanityContract() {
    let found = false;
    let count = 0;
    let startTime = Date.now();
    console.log("Searching for a contract address starting with BB and ending with BB...");
    while (!found) {
        // Generate a new random wallet
        const wallet = ethers_1.ethers.Wallet.createRandom();
        // Calculate the contract address that would be deployed by this wallet
        const nonce = 0; // First transaction
        const address = ethers_1.ethers.utils.getContractAddress({
            from: wallet.address,
            nonce: nonce
        });
        count++;
        if (count % 1000 === 0) {
            const timeElapsed = (Date.now() - startTime) / 1000;
            const rate = count / timeElapsed;
            console.log(`Tried ${count} addresses... (${rate.toFixed(2)} attempts/sec)`);
        }
        // Convert to checksum address for consistent comparison
        const checksumAddress = ethers_1.ethers.utils.getAddress(address);
        // Check if address matches our pattern (starts with BB and ends with BB)
        if (checksumAddress.slice(2, 4).toLowerCase() === 'bb' &&
            checksumAddress.slice(-2).toLowerCase() === 'bb') {
            console.log("\nFound matching address!");
            console.log("Contract Address:", checksumAddress);
            console.log("Deployer Address:", wallet.address);
            console.log("Private Key:", wallet.privateKey);
            console.log(`\nTime taken: ${(Date.now() - startTime) / 1000} seconds`);
            console.log(`Total attempts: ${count}`);
            found = true;
        }
    }
}
findVanityContract()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
