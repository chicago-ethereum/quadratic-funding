pragma solidity ^0.5.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";


contract CEM is ERC20, ERC20Detailed {
    constructor(uint256 initialSupply)
        public
        ERC20Detailed("Chicago Ethereum Meetup DAI", "chiDAI", 18)
    {
        _mint(msg.sender, initialSupply);
    }
}
