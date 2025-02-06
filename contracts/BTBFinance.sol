// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

contract BTBFinance is OFT {
    uint256 public immutable MAX_SUPPLY;
    uint256 public immutable MAIN_CHAIN_ID;

    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate,
        uint256 _maxSupply,
        uint256 _mainChainId
    ) OFT(_name, _symbol, _lzEndpoint, _delegate) Ownable(_delegate) {
        MAX_SUPPLY = _maxSupply;
        MAIN_CHAIN_ID = _mainChainId;

        // Mint supply only on the main chain
        if (block.chainid == MAIN_CHAIN_ID) {
            _mint(_delegate, MAX_SUPPLY);
        }
    }

}