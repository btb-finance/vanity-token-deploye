import assert from 'assert'

import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'BTBFinance'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    const endpointV2Deployment = await hre.deployments.get('EndpointV2')

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [
            'BTB Finance', // name
            'BTB', // symbol
            endpointV2Deployment.address, // LayerZero's EndpointV2 address
            deployer, // owner
            1_000_000_000n * 10n ** 18n, // maxSupply: 1 billion tokens with 18 decimals
            11155420, // mainChainId: OP Sepolia
        ],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)

    // Verify the contract if not on a local network
    if (hre.network.name !== 'hardhat' && hre.network.name !== 'localhost') {
        console.log('Verifying contract...')
        try {
            await hre.run('verify:verify', {
                address: address,
                contract: 'contracts/BTBFinance.sol:BTBFinance',
                constructorArguments: [
                    'BTB Finance', // name
                    'BTB', // symbol
                    endpointV2Deployment.address, // LayerZero's EndpointV2 address
                    deployer, // owner
                    1_000_000_000n * 10n ** 18n, // maxSupply: 1 billion tokens with 18 decimals
                    11155420, // mainChainId: OP Sepolia
                ],
            })
            console.log('Contract verification successful')
        } catch (error) {
            console.log('Contract verification failed:', error)
        }
    }
}

deploy.tags = [contractName]
export default deploy
