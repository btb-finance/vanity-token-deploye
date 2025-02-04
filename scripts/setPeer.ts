import { ethers } from 'hardhat'
import { EndpointId } from '@layerzerolabs/lz-definitions'
import { addressToBytes32 } from '@layerzerolabs/lz-v2-utilities'

async function main() {
    // Contract addresses
    const optimismSepoliaOFT = '0xB1ca5c3c195EB86956e369011f65B3A7B6E444BB'
    const baseSepoliaOFT = '0xB1ca5c3c195EB86956e369011f65B3A7B6E444BB'

    // Get the signer
    const [signer] = await ethers.getSigners()

    // Connect to the contract
    const BTBFinance = await ethers.getContractFactory('BTBFinance')
    const btbContract = BTBFinance.attach(optimismSepoliaOFT).connect(signer)

    // Convert peer address to bytes32
    const peerBytes32 = addressToBytes32(baseSepoliaOFT)

    // Set peer for Base Sepolia
    console.log('Setting peer for Base Sepolia...')
    const tx = await btbContract.setPeer(
        EndpointId.BASESEP_V2_TESTNET,
        peerBytes32,
        { gasLimit: 200000 }
    )

    console.log('Transaction hash:', tx.hash)
    console.log('Waiting for transaction confirmation...')
    await tx.wait()
    console.log('Peer set successfully!')
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
