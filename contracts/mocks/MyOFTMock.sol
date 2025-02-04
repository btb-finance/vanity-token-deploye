// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { BTBFinance } from "../BTBFinance.sol";

// @dev WARNING: This is for testing purposes only
contract MyOFTMock is BTBFinance {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
    ) BTBFinance(_name, _symbol, _lzEndpoint, _delegate, 1000000e18, block.chainid) {}

   
}
