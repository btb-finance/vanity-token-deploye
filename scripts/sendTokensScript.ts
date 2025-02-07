import { ethers } from 'ethers'
import { addressToBytes32, Options } from '@layerzerolabs/lz-v2-utilities'
import * as dotenv from 'dotenv'

dotenv.config()

interface TransactionError extends Error {
    transaction?: ethers.providers.TransactionRequest;
}

async function main() {
    // Connect to Optimism network
    const provider = new ethers.providers.JsonRpcProvider(process.env.OPTIMISM_RPC)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)

    // Contract addresses and configuration
    const btbContractAddress = '0xBBF88F780072F5141dE94E0A711bD2ad2c1f83BB'

    // Contract ABI - only including necessary functions
    const abi = [
        'function balanceOf(address) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function quoteSend(tuple(uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd), bool) view returns (tuple(uint256 nativeFee, uint256 lzTokenFee))',
        'function send(tuple(uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd), tuple(uint256 nativeFee, uint256 lzTokenFee), address payable) payable returns (bytes32)'
    ]

    // Connect to the contract
    const btbContract = new ethers.Contract(btbContractAddress, abi, wallet)

    // Check balances
    const decimals = await btbContract.decimals()
    const btbBalance = await btbContract.balanceOf(wallet.address)
    const ethBalance = await wallet.getBalance()

    console.log('Connected to BTB contract on Optimism')
    console.log(`Your BTB balance: ${ethers.utils.formatUnits(btbBalance, decimals)}`)
    console.log(`Your ETH balance: ${ethers.utils.formatEther(ethBalance)}`)

    // Amount to send (500 tokens)
    const amountToSend = ethers.utils.parseUnits('500', decimals)

    // Base chain configuration
    const baseChainId = 30184
    console.log(`\nSending 500 BTB to Base...`)
    console.log(`Chain EID: ${baseChainId}`)

    try {
        // Prepare send parameters with proper formatting
        const sendParam = {
            dstEid: baseChainId,
            to: addressToBytes32(wallet.address),
            amountLD: amountToSend,
            minAmountLD: amountToSend,
            extraOptions: Options.newOptions().addExecutorLzReceiveOption(200000, 0).toBytes(),
            composeMsg: '0x',
            oftCmd: '0x'
        }

        // Get quote for the send operation
        console.log('Getting quote...')
        const feeQuote = await btbContract.quoteSend(sendParam, false)
        const nativeFee = feeQuote.nativeFee

        console.log(`Native fee required: ${ethers.utils.formatEther(nativeFee)} ETH`)

        // Send tokens with proper overrides
        const tx = await btbContract.send(
            sendParam,
            {
                nativeFee,
                lzTokenFee: ethers.BigNumber.from(0)
            },
            wallet.address,
            {
                gasLimit: 300000,
                value: nativeFee
            }
        )

        console.log('Transaction hash:', tx.hash)
        console.log('Waiting for transaction confirmation...')
        await tx.wait()
        console.log('Transaction confirmed!')
        console.log(`See: https://layerzeroscan.com/tx/${tx.hash}`)

    } catch (error) {
        console.error(`Error sending to Base:`, error)
        const txError = error as TransactionError
        if (txError.transaction) {
            console.log('Transaction data:', txError.transaction)
        }
        throw error
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
