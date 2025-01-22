const hre = require("hardhat");
const { ethers } = require("hardhat");

async function getCurrentNonce(deployer) {
    return await ethers.provider.getTransactionCount(deployer.address);
}

async function deployToNetwork(networkName, lzEndpoint, chainId) {
    const [wallet] = await ethers.getSigners();
    console.log(`\nDeploying to ${networkName}...`);
    console.log("Deployer address:", wallet.address);
    
    // Get current nonce
    const currentNonce = await ethers.provider.getTransactionCount(wallet.address);
    console.log(`Current nonce: ${currentNonce}`);
    
    // Contract parameters
    const name = "btb";
    const symbol = "btb";
    const maxSupply = ethers.utils.parseUnits("1000000000", "ether");
    const mainChainId = chainId;
    const delegate = wallet.address;

    // Get checksum address for LZ endpoint
    const checksumLzEndpoint = ethers.utils.getAddress(lzEndpoint);
    console.log('LZ Endpoint:', checksumLzEndpoint);

    // Deploy the contract
    console.log("\nDeployment Parameters:");
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Max Supply:", ethers.utils.formatUnits(maxSupply, "ether"));
    console.log("Main Chain ID:", mainChainId);
    console.log("Delegate:", delegate);

    const Token = await ethers.getContractFactory("BTBToken", wallet);

    console.log('\nPreparing deployment transaction...');

    // Create deployment transaction
    const deploymentTx = await Token.getDeployTransaction(
        name,
        symbol,
        checksumLzEndpoint,
        delegate,
        maxSupply,
        mainChainId
    );

    // Set gas settings
    deploymentTx.gasLimit = ethers.BigNumber.from("5000000");
    deploymentTx.maxFeePerGas = ethers.utils.parseUnits("1.5", "gwei");
    deploymentTx.maxPriorityFeePerGas = ethers.utils.parseUnits("1.5", "gwei");
    deploymentTx.nonce = currentNonce;

    console.log("Gas Settings:");
    console.log("Gas Limit:", deploymentTx.gasLimit.toString());
    console.log("Max Fee Per Gas:", ethers.utils.formatUnits(deploymentTx.maxFeePerGas, "gwei"), "gwei");
    console.log("Max Priority Fee:", ethers.utils.formatUnits(deploymentTx.maxPriorityFeePerGas, "gwei"), "gwei");

    console.log("\nSending deployment transaction...");
    const deployTxResponse = await wallet.sendTransaction(deploymentTx);
    console.log("Transaction hash:", deployTxResponse.hash);
    
    console.log("\nWaiting for deployment confirmation...");
    const receipt = await deployTxResponse.wait();
    
    console.log("\nToken deployed to:", receipt.contractAddress);
    
    return {
        address: receipt.contractAddress,
        deployer: wallet.address,
        name: name,
        symbol: symbol,
        maxSupply: maxSupply.toString(),
        lzEndpoint: checksumLzEndpoint,
        mainChainId: mainChainId,
        timestamp: new Date().toISOString()
    };
}

async function main() {
    const mainChainId = 11155420; // OP Sepolia Chain ID for both deployments

    // Deploy to Base Sepolia first
    console.log("\n1. Deploying to Base Sepolia with OP Sepolia as main chain...");
    await deployToNetwork(
        "Base Sepolia",
        "0x6EDCE65403992e310A62460808c4b910D972f10f", // Base Sepolia LZ Endpoint
        mainChainId // Using OP Sepolia as main chain
    );

    // Deploy to OP Sepolia second
    console.log("\n2. Deploying to OP Sepolia...");
    await deployToNetwork(
        "OP Sepolia",
        "0x6EDCE65403992e310A62460808c4b910D972f10f", // OP Sepolia LZ Endpoint
        mainChainId
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
