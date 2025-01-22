const hre = require("hardhat");

async function verifyContract(address, constructorArgs, network) {
    console.log(`Verifying contract on ${network} at address: ${address}`);
    try {
        await hre.run("verify:verify", {
            address: address,
            constructorArguments: constructorArgs,
        });
        console.log("Verification successful!");
    } catch (error) {
        console.error("Verification failed:", error);
    }
}

async function main() {
    // Contract addresses
    const BASE_SEPOLIA_ADDRESS = "0xAD72A833Cd7CaF39f91cdb02cDaCA66DCaF6f518";
    const OP_SEPOLIA_ADDRESS = "0xCB29000dB7e2dF16f0e53ffD32DF4e06bd265359";

    // Constructor arguments
    const BASE_SEPOLIA_ARGS = [
        "btb", // name
        "btb", // symbol
        "0x6EDCE65403992e310A62460808c4b910D972f10f", // LZ endpoint
        "0x629455807f7AaacC41cBd486C635C1208993f3ee", // delegate
        "1000000000000000000000000000", // max supply (1 billion with 18 decimals)
        11155420 // mainChainId (OP Sepolia)
    ];

    const OP_SEPOLIA_ARGS = [
        "btb", // name
        "btb", // symbol
        "0x6EDCE65403992e310A62460808c4b910D972f10f", // LZ endpoint
        "0x629455807f7AaacC41cBd486C635C1208993f3ee", // delegate
        "1000000000000000000000000000", // max supply (1 billion with 18 decimals)
        11155420 // mainChainId (OP Sepolia)
    ];

    // Verify on Base Sepolia
    await verifyContract(BASE_SEPOLIA_ADDRESS, BASE_SEPOLIA_ARGS, "Base Sepolia");

    // Verify on OP Sepolia
    await verifyContract(OP_SEPOLIA_ADDRESS, OP_SEPOLIA_ARGS, "OP Sepolia");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
