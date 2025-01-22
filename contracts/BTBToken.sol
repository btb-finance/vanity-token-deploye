// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BTBToken is ERC20, Ownable {
    uint8 private _decimals = 18;
    uint256 private _initialSupply = 1000000 * (10 ** _decimals); // 1 million tokens

    constructor() ERC20("BTB Token", "BTB") {
        _mint(msg.sender, _initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
