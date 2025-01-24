const { ethers } = require("hardhat");
require("dotenv").config();

// Contract ABI - Including all necessary functions for cross-chain operations
const BTB_ABI = [
    // Standard ERC20 functions
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
    "function totalSupply() view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",
    // Owner functions
    "function owner() view returns (address)",
    // LayerZero specific functions
    "function quoteSend(tuple(uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) sendParam, bool payInLzToken) view returns (tuple(uint256 nativeFee, uint256 lzTokenFee))",
    "function send(tuple(uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) sendParam, tuple(uint256 nativeFee, uint256 lzTokenFee) fee, address refundAddress, bytes callParams) payable returns (tuple(bytes32 guid, uint64 nonce))",
    "function setPeer(uint32 _chainId, bytes32 _peer) external",
    "function peers(uint32) view returns (bytes32)",
    // Additional LayerZero functions
    "function endpoint() view returns (address)",
    "function MAX_SUPPLY() view returns (uint256)",
    "function MAIN_CHAIN_ID() view returns (uint256)"
];

// LayerZero adapter parameters
const ADAPTER_PARAMS = ethers.utils.solidityPack(
    ["uint16", "uint256"],
    [1, 200000] // version 1, gas limit 200000
);

// Contract verification function
async function verifyContract(contractAddress, network, signer) {
    console.log(`\nVerifying contract on ${network}...`);
    
    const contract = new ethers.Contract(contractAddress, BTB_ABI, signer);
    
    try {
        // Check if contract exists by calling basic functions
        const [name, symbol, decimals, totalSupply] = await Promise.all([
            contract.name().catch(() => 'Unknown'),
            contract.symbol().catch(() => 'Unknown'),
            contract.decimals().catch(() => 'Unknown'),
            contract.totalSupply().catch(() => 'Unknown')
        ]);

        console.log('Contract details:');
        console.log(`- Name: ${name}`);
        console.log(`- Symbol: ${symbol}`);
        console.log(`- Decimals: ${decimals}`);
        console.log(`- Total Supply: ${ethers.utils.formatEther(totalSupply)}`);

        // Try to get the owner
        try {
            const owner = await contract.owner();
            console.log(`- Owner: ${owner}`);
            console.log(`- You are ${owner.toLowerCase() === signer.address.toLowerCase() ? '' : 'not '}the owner`);
        } catch (e) {
            console.log('- Could not verify owner');
        }

        // Try to get the LayerZero endpoint
        try {
            const endpoint = await contract.endpoint();
            console.log(`- LayerZero Endpoint: ${endpoint}`);
        } catch (e) {
            console.log('- Could not verify LayerZero endpoint');
        }

        return true;
    } catch (error) {
        console.error(`\n❌ Contract verification failed:`);
        console.error(`- Address: ${contractAddress}`);
        console.error(`- Network: ${network}`);
        console.error(`- Error: ${error.message}`);
        return false;
    }
};


// Chain configuration for Base and Optimism Sepolia
const config = {
    baseSepolia: {
        chainId: 84532,
        eid: 40245,
        contractAddress: "0xB007DC5738a8789DadB6861745f1bDfBc1400C6B"
    },
    optimismSepolia: {
        chainId: 11155420,
        eid: 40232,
        contractAddress: "0xB007DC5738a8789DadB6861745f1bDfBc1400C6B"
    }
};

async function crossChainTransfer(recipientAddress, amount, sourceNetwork, destinationNetwork) {
    try {
        // Initial setup and connections
        const provider = ethers.provider;
        const signer = await ethers.getSigner();
        console.log(`Using signer address: ${signer.address}`);

        // Configure peers for cross-chain messaging
        console.log("\nSetting up peer configuration...");
        const BTBToken = await ethers.getContractFactory("BTBToken");
        const sourceToken = await BTBToken.attach(config[sourceNetwork].contractAddress);
        
        // Create peer configuration
        const peerBytes = ethers.utils.hexZeroPad(config[destinationNetwork].contractAddress, 32);
        
        try {
            console.log("Configuring peer relationship...");
            const setPeerTx = await sourceToken.setPeer(config[destinationNetwork].eid, peerBytes);
            await setPeerTx.wait();
            console.log("✅ Peer configuration successful");

            // Verify peer configuration
            const currentPeer = await sourceToken.peers(config[destinationNetwork].eid);
            console.log("Verified peer configuration:", currentPeer);
            console.log("Expected peer:", peerBytes);
            console.log("Peer match:", currentPeer === peerBytes);
        } catch (error) {
            console.log("Note: Peer already configured or error occurred:", error.message);
        }

        // Setup token contract instance
        const tokenContract = new ethers.Contract(
            config[sourceNetwork].contractAddress,
            BTB_ABI,
            signer
        );

        // Convert amount to Wei for token operations
        const amountInWei = ethers.utils.parseEther(amount.toString());

        // Check token balance
        const balance = await tokenContract.balanceOf(signer.address);
        console.log(`\nCurrent balance: ${ethers.utils.formatEther(balance)} BTB`);
        if (balance.lt(amountInWei)) {
            throw new Error(`Insufficient balance. Required: ${amount} BTB, Available: ${ethers.utils.formatEther(balance)} BTB`);
        }

        // Handle token approvals
        const currentAllowance = await tokenContract.allowance(signer.address, config[sourceNetwork].contractAddress);
        if (currentAllowance.lt(amountInWei)) {
            console.log("\nApproving token transfer...");
            const approveTx = await tokenContract.approve(config[sourceNetwork].contractAddress, amountInWei);
            await approveTx.wait();
            console.log("✅ Token approval confirmed");
        }

        // Create LayerZero V2 message options with proper gas configuration
        const adapterParams = ethers.utils.solidityPack(
            ['uint16', 'uint256'],
            [
                1,              // Version 1 for the adapter
                200000          // Gas limit
            ]
        );

        // Create type 3 options encoding for OFT V2
        const options = ethers.utils.solidityPack(
            ['uint16', 'uint256', 'bytes'],
            [
                3,              // Options type must be 3 for OFT V2
                200000,         // Execution gas limit
                adapterParams   // Adapter parameters
            ]
        );

        // Prepare the cross-chain send parameters
        const sendParam = {
            dstEid: config[destinationNetwork].eid,
            to: ethers.utils.hexZeroPad(recipientAddress, 32),
            amountLD: amountInWei,
            minAmountLD: amountInWei,
            extraOptions: options,
            composeMsg: "0x",      // empty compose msg for simple transfers
            oftCmd: "0x"           // no special OFT commands
        };

        console.log("\nInitiating cross-chain transfer...");
        console.log(`From: ${sourceNetwork} (${config[sourceNetwork].contractAddress})`);
        console.log(`To: ${destinationNetwork} (${config[destinationNetwork].contractAddress})`);
        console.log(`Amount: ${amount} BTB`);
        console.log(`Recipient: ${recipientAddress}`);

        // Add debugging to verify parameters
        console.log("Detailed send parameters:", {
            dstEid: sendParam.dstEid,
            to: sendParam.to,
            amountLD: ethers.utils.formatEther(sendParam.amountLD),
            minAmountLD: ethers.utils.formatEther(sendParam.minAmountLD),
            extraOptions: sendParam.extraOptions,
            optionsType: sendParam.extraOptions.slice(0, 4) // Should show 0003
        });

        // Get fee quote from LayerZero
        console.log("\nGetting LayerZero fee quote...");
        let quote;
        try {
            quote = await tokenContract.quoteSend(sendParam, false);
            console.log("Fee quote received:", {
                nativeFee: ethers.utils.formatEther(quote.nativeFee),
                lzTokenFee: ethers.utils.formatEther(quote.lzTokenFee)
            });
        } catch (error) {
            console.error("LayerZero fee quote failed:");
            console.error("Error code:", error.code);
            console.error("Error data:", error.data);
            console.error("Transaction:", error.transaction);
            console.error("Send parameters:", {
                dstEid: sendParam.dstEid,
                to: sendParam.to,
                amount: ethers.utils.formatEther(sendParam.amountLD),
                minAmount: ethers.utils.formatEther(sendParam.minAmountLD),
                extraOptions: sendParam.extraOptions
            });
            throw new Error(`LayerZero fee quote failed: ${error.message}`)
        }

        // Execute the cross-chain transfer
        console.log("\nExecuting transfer...");
        const tx = await tokenContract.send(
            sendParam,
            {
                nativeFee: quote.nativeFee,
                lzTokenFee: quote.lzTokenFee
            },
            signer.address,
            "0x",  // Empty callParams since we're doing a simple transfer
            { 
                value: quote.nativeFee.mul(125).div(100), // 25% buffer for gas fluctuations
                gasLimit: 1000000 // Reduced gas limit while maintaining safety
            }
        );

        console.log(`Transaction submitted: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`\n✅ Transfer successful!`);
        console.log(`Block: ${receipt.blockNumber}`);
        console.log(`Gas used: ${receipt.gasUsed.toString()}`);

    } catch (error) {
        console.error("\n❌ Transfer failed:");
        console.error("Error message:", error.message);
        
        if (error.data) {
            console.error("Error data:", error.data);
            if (error.data.message) {
                console.error("LayerZero error:", error.data.message);
            }
        }
        
        // Check for specific error conditions
        if (error.message.includes("insufficient funds")) {
            console.error("💡 Solution: Please ensure you have enough native tokens for gas fees");
        } else if (error.message.includes("execution reverted")) {
            console.error("💡 Solution: Contract execution failed. Check the following:");
            console.error("  - Verify peer configuration is correct");
            console.error("  - Ensure you have enough tokens for transfer");
            console.error("  - Confirm gas settings are appropriate");
        }
        
        throw error;
    }
}

// Main execution function
async function main() {
    const recipientAddress = "0x1c85bc87468A90482eD75a8530DEDba57ABBd9ec";
    const amount = "0.1";
    
    const signer = await ethers.getSigner();
    console.log(`Using signer address: ${signer.address}`);

    // Verify contracts on both networks first
    const sourceValid = await verifyContract(
        "0xB007DC5738a8789DadB6861745f1bDfBc1400C6B",
        "Optimism Sepolia",
        signer
    );

    const destValid = await verifyContract(
        "0xB007DC5738a8789DadB6861745f1bDfBc1400C6B",
        "Base Sepolia",
        signer
    );

    if (!sourceValid || !destValid) {
        throw new Error("Contract verification failed. Please check the contract addresses and deployment status.");
    }

    await crossChainTransfer(
        recipientAddress,
        amount,
        "optimismSepolia",
        "baseSepolia"
    );
}

// Script execution
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { crossChainTransfer };