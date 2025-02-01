import { ethers } from 'hardhat'
import { Options, addressToBytes32 } from '@layerzerolabs/lz-v2-utilities'
import { EndpointId } from '@layerzerolabs/lz-definitions'
import { getNetworkNameForEid } from '@layerzerolabs/devtools-evm-hardhat'

async function main() {
    // Contract addresses from deployments
    const optimismSepoliaOFT = ''
    const baseSepoliaOFT = ''

    // Get the signer
    const [signer] = await ethers.getSigners()

    // Connect to the Optimism Sepolia OFT contract
    const MyOFT = await ethers.getContractFactory('MyOFT')
    const oftContract = MyOFT.attach(optimismSepoliaOFT).connect(signer)

    // Get token decimals
    const decimals = await oftContract.decimals()
    const amount = ethers.utils.parseUnits('5', decimals) // Changed to send 5 tokens

    // Prepare send parameters
    const dstEid = EndpointId.BASESEP_V2_TESTNET
    const to = addressToBytes32(baseSepoliaOFT) // Changed to send to Base Sepolia contract
    
    // Define message execution options with gas limit
    const options = Options.newOptions().addExecutorLzReceiveOption(65000, 0).toBytes()

    const sendParam = {
        dstEid,
        to,
        amountLD: amount,
        minAmountLD: amount,
        extraOptions: options,
        composeMsg: ethers.utils.arrayify('0x'),
        oftCmd: ethers.utils.arrayify('0x')
    }

    // Get the quote for the send operation
    const feeQuote = await oftContract.quoteSend(sendParam, false)
    const nativeFee = feeQuote.nativeFee

    console.log(`Sending 5 token(s) to network ${getNetworkNameForEid(dstEid)} (${dstEid})`)
    console.log(`Destination contract: ${baseSepoliaOFT}`)
    console.log(`Native fee required: ${ethers.utils.formatEther(nativeFee)} ETH`)

    try {
        // Check if this is an OFT Adapter
        const innerTokenAddress = await oftContract.token()
        if (innerTokenAddress !== oftContract.address) {
            const ERC20Factory = await ethers.getContractFactory('ERC20')
            const innerToken = ERC20Factory.attach(innerTokenAddress)
            await innerToken.approve(oftContract.address, amount)
        }

        // Send tokens
        const tx = await oftContract.send(
            sendParam,
            { nativeFee, lzTokenFee: 0 },
            signer.address,
            { value: nativeFee }
        )

        console.log('Transaction hash:', tx.hash)
        console.log('Waiting for transaction confirmation...')
        await tx.wait()
        console.log('Transaction confirmed!')
        console.log(`See: https://layerzeroscan.com/tx/${tx.hash}`)
    } catch (error) {
        console.error('Error sending tokens:', error)
        throw error
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
