import { run } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

async function main() {
    console.log('Starting contract verification...');

    const networks = [
        {
            name: 'optimism-sepolia',
            contractName: 'BTBFinance'
        },
        {
            name: 'base-sepolia',
            contractName: 'BTBFinance'
        }
    ];

    for (const network of networks) {
        console.log(`\nVerifying ${network.contractName} on ${network.name}...`);
        try {
            await run('verify:verify', {
                network: network.name,
                contract: network.contractName,
            });
            console.log(`✅ ${network.contractName} verified successfully on ${network.name}`);
        } catch (error) {
            console.error(`❌ Failed to verify ${network.contractName} on ${network.name}:`);
            console.error(error);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });