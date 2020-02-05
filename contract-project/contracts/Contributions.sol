pragma solidity ^0.5.15;
// needed to use structs everywhere before Solidity 0.6.x
// pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@nomiclabs/buidler/console.sol";
import "./CEM.sol";


contract Contributions is Ownable {
    mapping(address => address[]) private _senderAddresses;
    mapping(address => uint256[]) private _contributionAmounts;

    mapping(address => bool) private _approvedRecipients;

    mapping(string => address) private _nicknames;

    // struct Contribution {
    //   address sender;
    //   address recipient;
    //   uint256 amount;
    // }

    function getRecipientAddress(string memory nickname)
        public
        view
        returns (address recipient)
    {
        return _nicknames[nickname];
    }

    function addRecipient(address recipient, string memory nickname)
        public
        onlyOwner
    {
        _approvedRecipients[recipient] = true;
        _nicknames[nickname] = recipient;
    }

    function removeRecipient(string memory nickname) public onlyOwner {
        address recipient = getRecipientAddress(nickname);
        _approvedRecipients[recipient] = false;
        delete _nicknames[nickname];
    }

    function contribute(address sender, string memory nickname, uint256 amount)
        public
        returns (bool)
    {
        console.log("contribute called in Solidity");
        require(amount > 0, "Contribution amount must be greater than 0");
        address recipient = getRecipientAddress(nickname);
        require(
            _approvedRecipients[recipient] == true,
            "Recipient must be approved"
        );
        _senderAddresses[recipient].push(sender);
        _contributionAmounts[recipient].push(amount);
        // Transfer the token as an internal tx if ERC20 approved
        return true;
    }

    function listContributors(string memory nickname)
        public
        view
        returns (address[] memory senderAddresses)
    {
        address recipient = getRecipientAddress(nickname);
        return _senderAddresses[recipient];
    }

    function listAmounts(string memory nickname)
        public
        view
        returns (uint256[] memory contributionAmounts)
    {
        address recipient = getRecipientAddress(nickname);
        return _contributionAmounts[recipient];
    }
}
