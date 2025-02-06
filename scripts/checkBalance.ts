import { ethers } from 'hardhat'

async function main() {
    // Contract address
    const contractAddress = '0xB1ca5c3c195EB86956e369011f65B3A7B6E444BB'

    // Get the signer
    const [signer] = await ethers.getSigners()

    // Connect to the contract
    const BTBFinance = await ethers.getContractFactory('BTBFinance')
    const btbContract = BTBFinance.attach(contractAddress).connect(signer)

    // Get token balance
    const balance = await btbContract.balanceOf(signer.address)
    const decimals = await btbContract.decimals()
    const balanceInTokens = ethers.utils.formatUnits(balance, decimals)

    console.log(`Token balance for ${signer.address}: ${balanceInTokens} BTB`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
