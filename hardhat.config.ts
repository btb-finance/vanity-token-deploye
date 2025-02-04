// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import 'dotenv/config'

import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import '@layerzerolabs/toolbox-hardhat'
import '@nomicfoundation/hardhat-verify'

import './tasks/sendMessage' // Import the task
import './tasks/sendTokens' // Import the sendTokens task from tasks directory
import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
      ? [PRIVATE_KEY]
      : undefined

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

const config: HardhatUserConfig = {
    paths: {
        cache: 'cache/hardhat',
    },
    etherscan: {
        apiKey: {
            'optimism-sepolia': process.env.OPTIMISTIC_API_KEY,
            'base-sepolia': process.env.BASESCAN_API_KEY,
        },
        customChains: [
            {
                network: 'base-sepolia',
                chainId: 84532,
                urls: {
                    apiURL: 'https://api-sepolia.basescan.org/api',
                    browserURL: 'https://sepolia.basescan.org',
                },
            },
            {
                network: 'optimism-sepolia',
                chainId: 11155420,
                urls: {
                    apiURL: 'https://api-sepolia-optimistic.etherscan.io/api',
                    browserURL: 'https://sepolia-optimism.etherscan.io',
                },
            },
        ],
    },
    sourcify: {
        enabled: true,
        apiUrl: 'https://sourcify.dev/server',
        browserUrl: 'https://sourcify.dev',
    },
    solidity: {
        version: '0.8.22',
        settings: {
            optimizer: {
                enabled: Boolean(process.env.OPTIMIZER_ENABLED),
                runs: 200,
            },
        },
    },
    networks: {
        'arbitrum-sepolia': {
            eid: EndpointId.ARBSEP_V2_TESTNET,
            url: process.env.RPC_URL_ARBITRUM_SEPOLIA || 'https://sepolia.arbitrum.io/rpc',
            accounts,
        },
        'op-sepolia': {
            url: process.env.TESTNET_RPC_OP_SEPOLIA || 'https://sepolia.optimism.io',
            accounts,
            verify: {
                etherscan: {
                    apiKey: process.env.OPTIMISTIC_API_KEY,
                },
            },
        },
        'base-sepolia': {
            eid: EndpointId.BASESEP_V2_TESTNET,
            url: process.env.RPC_URL_BASE_SEPOLIA || 'https://sepolia.base.org',
            accounts,
            verify: {
                etherscan: {
                    apiKey: process.env.BASESCAN_API_KEY,
                },
            },
        },
        'optimism-sepolia': {
            eid: EndpointId.OPTSEP_V2_TESTNET,
            url: process.env.RPC_URL_OPTIMISM_SEPOLIA || 'https://sepolia.optimism.io',
            accounts,
        },
        hardhat: {
            // Need this for testing because TestHelperOz5.sol is exceeding the compiled contract size limit
            allowUnlimitedContractSize: true,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // wallet address of index[0], of the mnemonic in .env
        },
    },
}

export default config
