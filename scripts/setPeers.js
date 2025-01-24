const { ethers, network } = require("hardhat");

async function main() {
    // Validate network
    if (!['optimism-sepolia', 'base-sepolia'].includes(network.name)) {
        throw new Error(`Invalid network. Please use either optimism-sepolia or base-sepolia. Current network: ${network.name}`);
    }
    // Contract addresses from previous deployments
    const baseContractAddress = "0xb007dc5738a8789dadb6861745f1bdfbc1400c6b";
    const optimismContractAddress = "0xb007dc5738a8789dadb6861745f1bdfbc1400c6b";

    // Chain IDs for LayerZero
    const BASE_SEPOLIA_EID = 10160;     // Base Sepolia Endpoint ID
    const OP_SEPOLIA_EID = 10132;       // Optimism Sepolia Endpoint ID

    // Get contract factory
    const BTBToken = await ethers.getContractFactory("BTBToken");

    try {
        if (network.name === 'optimism-sepolia') {
            console.log("Setting peer on Optimism Sepolia...")
            const optimismToken = await BTBToken.attach(optimismContractAddress);
            console.log("Sending setPeer transaction...")
            const basePeerBytes = ethers.utils.hexZeroPad(baseContractAddress, 32);
            
            // Estimate gas for the transaction
            const gasEstimate = await optimismToken.estimateGas.setPeer(BASE_SEPOLIA_EID, basePeerBytes);
            const tx1 = await optimismToken.setPeer(BASE_SEPOLIA_EID, basePeerBytes, {
                gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
            });
            
            console.log("Waiting for transaction confirmation...")
            await tx1.wait();
            console.log(`✅ Set Base Sepolia (${baseContractAddress}) as peer on Optimism Sepolia`);
        } else {
            console.log("Setting peer on Base Sepolia...")
            const baseToken = await BTBToken.attach(baseContractAddress);
            console.log("Sending setPeer transaction...")
            const optimismPeerBytes = ethers.utils.hexZeroPad(optimismContractAddress, 32);
            
            // Estimate gas for the transaction
            const gasEstimate = await baseToken.estimateGas.setPeer(OP_SEPOLIA_EID, optimismPeerBytes);
            const tx2 = await baseToken.setPeer(OP_SEPOLIA_EID, optimismPeerBytes, {
                gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
            });
            
            console.log("Waiting for transaction confirmation...")
            await tx2.wait();
            console.log(`✅ Set Optimism Sepolia (${optimismContractAddress}) as peer on Base Sepolia`);
        }

        console.log("\n🎉 Peering setup completed successfully!");
    } catch (error) {
        console.error("Error setting peers:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });