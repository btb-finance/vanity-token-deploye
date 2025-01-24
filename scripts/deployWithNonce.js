const hre = require("hardhat");
const { ethers } = require("hardhat");

async function getCurrentNonce(deployer) {
    return await ethers.provider.getTransactionCount(deployer.address);
}

async function deployToNetwork(networkName, lzEndpoint, chainId) {
    // Verify network connection
    const network = await ethers.provider.getNetwork();
    console.log(`Connected to network with chainId: ${network.chainId}`);

    const [wallet] = await ethers.getSigners();
    console.log(`\nDeploying to ${networkName}...`);
    console.log("Deployer address:", wallet.address);
    
    // Verify wallet balance
    const balance = await wallet.getBalance();
    if (balance.isZero()) {
        throw new Error(`Insufficient balance in wallet: ${wallet.address}`);
    }
    console.log(`Wallet balance: ${ethers.utils.formatEther(balance)} ETH`);

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

    // Estimate gas and get current gas prices
    const gasLimit = await ethers.provider.estimateGas(deploymentTx);
    const feeData = await ethers.provider.getFeeData();

    // Set gas settings with 20% buffer
    deploymentTx.gasLimit = gasLimit.mul(120).div(100);
    deploymentTx.maxFeePerGas = feeData.maxFeePerGas.mul(120).div(100);
    deploymentTx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas.mul(120).div(100);
    deploymentTx.nonce = currentNonce;

    console.log("Gas Settings:");
    console.log("Estimated Gas Limit:", gasLimit.toString());
    console.log("Gas Limit with buffer:", deploymentTx.gasLimit.toString());
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
    const network = await ethers.provider.getNetwork();
    const mainChainId = 11155420; // OP Sepolia Chain ID for both deployments

    // Network-specific configurations
    const networks = {
        "base-sepolia": {
            chainId: 84532,
            name: "Base Sepolia",
            lzEndpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f"
        },
        "optimism-sepolia": {
            chainId: 11155420,
            name: "OP Sepolia",
            lzEndpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f"
        }
    };

    // Get current network configuration
    const currentNetwork = Object.values(networks).find(n => n.chainId === network.chainId);
    if (!currentNetwork) {
        throw new Error(`Unsupported network. Connected to chain ID: ${network.chainId}`);
    }

    console.log(`\nDeploying to ${currentNetwork.name}...`);
    try {
        await deployToNetwork(
            currentNetwork.name,
            currentNetwork.lzEndpoint,
            mainChainId
        );
    } catch (error) {
        console.error(`\nDeployment failed:`, error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
