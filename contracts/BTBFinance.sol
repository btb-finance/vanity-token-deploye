// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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

    // Allow contract to receive ETH
    receive() external payable {}

    function withdrawETH(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = to.call{value: amount}("");
        require(success, "ETH transfer failed");
    }

    function withdrawERC20(address token, address to, uint256 amount) external onlyOwner {
        require(token != address(0) && to != address(0), "Invalid address");
        IERC20 tokenContract = IERC20(token);
        require(amount <= tokenContract.balanceOf(address(this)), "Insufficient balance");
        require(tokenContract.transfer(to, amount), "Token transfer failed");
    }
}
