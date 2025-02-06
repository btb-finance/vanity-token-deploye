// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {BTBFinance} from "../contracts/BTBFinance.sol";

contract DeployAll is Script {
    // Event to track deployments
    event Deployed(string network, uint256 chainId, address token);

    struct NetworkConfig {
        string name;
        uint256 chainId;
        address lzEndpoint;
    }

    function getNetworkConfigs() internal pure returns (NetworkConfig[] memory) {
        // Define networks to deploy to
        NetworkConfig[] memory configs = new NetworkConfig[](10);
        
        // Ethereum Mainnet
        configs[0] = NetworkConfig({
            name: "ethereum",
            chainId: 1,
            lzEndpoint: 0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675
        });

        // Polygon
        configs[1] = NetworkConfig({
            name: "polygon",
            chainId: 137,
            lzEndpoint: 0x3c2269811836af69497E5F486A85D7316753cf62
        });

        // Arbitrum
        configs[2] = NetworkConfig({
            name: "arbitrum",
            chainId: 42161,
            lzEndpoint: 0x3c2269811836af69497E5F486A85D7316753cf62
        });

        // Optimism
        configs[3] = NetworkConfig({
            name: "optimism",
            chainId: 10,
            lzEndpoint: 0x1a44076050125825900e736c501f859c50fE728c
        });

        // Base
        configs[4] = NetworkConfig({
            name: "base",
            chainId: 8453,
            lzEndpoint: 0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7
        });

        // BNB Chain
        configs[5] = NetworkConfig({
            name: "bnb",
            chainId: 56,
            lzEndpoint: 0x3c2269811836af69497E5F486A85D7316753cf62
        });

        // Blast
        configs[6] = NetworkConfig({
            name: "blast",
            chainId: 81457,
            lzEndpoint: 0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7
        });

        // World
        configs[7] = NetworkConfig({
            name: "world",
            chainId: 91715,
            lzEndpoint: 0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675
        });

        // Avalanche
        configs[8] = NetworkConfig({
            name: "avalanche",
            chainId: 43114,
            lzEndpoint: 0x3c2269811836af69497E5F486A85D7316753cf62
        });

        // Zora
        configs[9] = NetworkConfig({
            name: "zora",
            chainId: 7777777,
            lzEndpoint: 0x1a44076050125825900e736c501f859c50fE728c
        });

        return configs;
    }

    function deployToNetwork(
        string memory name,
        string memory symbol,
        address lzEndpoint,
        address delegate,
        uint256 maxSupply,
        uint256 mainChainId,
        string memory networkName,
        uint256 chainId
    ) public returns (address) {
        try new BTBFinance(
            name,
            symbol,
            lzEndpoint,
            delegate,
            maxSupply,
            mainChainId
        ) returns (BTBFinance token) {
            emit Deployed(networkName, chainId, address(token));
            return address(token);
        } catch {
            emit Deployed(string.concat(networkName, " (FAILED)"), chainId, address(0));
            return address(0);
        }
    }

    function run() public {
        // Get the private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        NetworkConfig[] memory configs = getNetworkConfigs();
        
        for (uint256 i = 0; i < configs.length; i++) {
            deployToNetwork(
                "BTB Finance",
                "BTB",
                configs[i].lzEndpoint,
                deployer,
                1_000_000_000 * 1e18,  // 1 billion tokens
                10, // Optimism is the main chain
                configs[i].name,
                configs[i].chainId
            );
        }

        vm.stopBroadcast();
    }
}
