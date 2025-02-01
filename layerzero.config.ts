import { EndpointId } from '@layerzerolabs/lz-definitions'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const baseSepoliaContract: OmniPointHardhat = {
    eid: EndpointId.BASESEP_V2_TESTNET,
    contractName: 'MyOFT',
}

const optimismSepoliaContract: OmniPointHardhat = {
    eid: EndpointId.OPTSEP_V2_TESTNET,
    contractName: 'MyOFT',
}

const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: baseSepoliaContract,
        },
        {
            contract: optimismSepoliaContract,
        },
    ],
    connections: [
        {
            from: optimismSepoliaContract,
            to: baseSepoliaContract,
        },
       
            {
                from: baseSepoliaContract,
                to: optimismSepoliaContract,
            },
    ],
}

export default config
