import { ethers } from 'hardhat'

async function main() {
    // Get the signer
    const [signer] = await ethers.getSigners()

    // Get ETH balance
    const balance = await signer.getBalance()
    const balanceInEth = ethers.utils.formatEther(balance)

    console.log(`ETH balance for ${signer.address}: ${balanceInEth} ETH`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
