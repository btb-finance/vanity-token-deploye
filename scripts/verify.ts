import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { task } from 'hardhat/config';

task('verify-contracts', 'Verify contracts on block explorers')
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    console.log('Starting contract verification...');

    const networks = ['base-sepolia', 'optimism-sepolia'];
    //ok
    // Get deployment information
    const getDeploymentInfo = async (network: string) => {
      try {
        const deployment = require(`../deployments/${network}/BTBFinance.json`);
        return {
          address: deployment.address,
          constructorArguments: deployment.args
        };
      } catch (error) {
        throw new Error(`Failed to load deployment info for ${network}: ${error.message}`);
      }
    };

    for (const network of networks) {
      console.log(`\nVerifying on ${network}...`);
      try {
        // Check if API key is available
        const apiKey = hre.config.etherscan?.apiKey?.[network];
        if (!apiKey) {
          throw new Error(`Missing API key for ${network}. Please add ${network.toUpperCase()}_API_KEY to your .env file`);
        }

        await hre.run('verify:verify', {
          ...(await getDeploymentInfo(network)),
          contract: 'contracts/BTBFinance.sol:BTBFinance',
          network: network,
        });
        console.log(`✅ Verification successful on ${network}`);
      } catch (error) {
        console.error(`❌ Verification failed on ${network}:`, error.message || error);
      }
    }
  });