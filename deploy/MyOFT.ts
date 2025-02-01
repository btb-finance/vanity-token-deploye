import assert from 'assert'

import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'MyOFT'

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
                contract: 'contracts/MyOFT.sol:MyOFT',
                constructorArguments: [
                    'BTB Finance', // name
                    'BTB', // symbol
                    endpointV2Deployment.address, // LayerZero's EndpointV2 address
                    deployer, // owner
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
