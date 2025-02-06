import { ethers } from 'hardhat'

async function main() {
    // Contract address from deployment
    const optimismSepoliaOFT = '0xA0c407153e986788834a78bC8f5eCE6b623a6D71'

    // Get the signer
    const [signer] = await ethers.getSigners()

    // Connect to the OFT contract
    const MyOFTMock = await ethers.getContractFactory('MyOFT')
    const optimismOFT = MyOFTMock.attach(optimismSepoliaOFT).connect(signer)

    // Amount to mint (10 tokens with 18 decimals)
    const mintAmount = ethers.utils.parseEther('10')

    try {
        console.log('Minting tokens on Optimism Sepolia...')
        const tx = await optimismOFT.mint(signer.address, mintAmount)
        console.log('Transaction hash:', tx.hash)

        // Wait for transaction confirmation
        await tx.wait()
        console.log('Minting successful!')

        // Get and display the new balance
        const balance = await optimismOFT.balanceOf(signer.address)
        console.log(`New balance: ${ethers.utils.formatEther(balance)} tokens`)
    } catch (error) {
        console.error('Error minting tokens:', error)
        throw error
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})