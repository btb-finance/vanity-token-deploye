import { ethers } from 'hardhat'
import { EndpointId } from '@layerzerolabs/lz-definitions'
import { addressToBytes32, Options } from '@layerzerolabs/lz-v2-utilities'

async function main() {
    // Contract addresses
    const optimismSepoliaOFT = '0xB1ca5c3c195EB86956e369011f65B3A7B6E444BB'
    const baseSepoliaOFT = '0xB1ca5c3c195EB86956e369011f65B3A7B6E444BB'
/// nothing
    // Get the signer
    const [signer] = await ethers.getSigners()

    // Connect to the contract
    const BTBFinance = await ethers.getContractFactory('BTBFinance')
    const btbContract = BTBFinance.attach(optimismSepoliaOFT).connect(signer)

    // Get token decimals and prepare amount
    const decimals = await btbContract.decimals()
    const amount = ethers.utils.parseUnits('1.0', decimals)

    // Prepare send parameters
    const sendParam = {
        dstEid: EndpointId.BASESEP_V2_TESTNET,
        to: addressToBytes32(baseSepoliaOFT),
        amountLD: amount,
        minAmountLD: amount,
        extraOptions: Options.newOptions().addExecutorLzReceiveOption(200000, 0).toBytes(),
        composeMsg: ethers.utils.arrayify('0x'),
        oftCmd: ethers.utils.arrayify('0x')
    }

    // Get the quote for the send operation
    console.log('Getting quote...')
    const feeQuote = await btbContract.quoteSend(sendParam, false)
    const nativeFee = feeQuote.nativeFee

    console.log(`Sending 1.0 token(s) to Base Sepolia`)
    console.log(`Native fee required: ${ethers.utils.formatEther(nativeFee)} ETH`)

    // Send tokens
    const tx = await btbContract.send(
        sendParam,
        {
            nativeFee,
            lzTokenFee: ethers.BigNumber.from(0)
        },
        signer.address,
        {
            gasLimit: 300000,
            gasPrice: ethers.utils.parseUnits('20', 'gwei'),
            value: nativeFee
        }
    )

    console.log('Transaction hash:', tx.hash)
    console.log('Waiting for transaction confirmation...')
    await tx.wait()
    console.log('Transaction confirmed!')
    console.log(`See: https://layerzeroscan.com/tx/${tx.hash}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
