pragma solidity ^0.5.15;
// needed to use structs everywhere before Solidity 0.6.x
// pragma experimental ABIEncoderV2;

import "@nomiclabs/buidler/console.sol";

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract Contributions is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // ERC20 basic token contract being held
    IERC20 private _token;

    mapping(address => address[]) private _senderAddresses;
    mapping(address => uint256[]) private _contributionAmounts;

    mapping(address => bool) private _approvedRecipients;

    mapping(string => address) private _nicknames;

    // struct Contribution {
    //   address sender;
    //   address recipient;
    //   uint256 amount;
    // }

    function setToken(IERC20 token) public onlyOwner {
        _token = token;
    }

    /**
     * @return the token used for this contract
     */
    function token() public view returns (IERC20) {
        return _token;
    }

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

    // TODO: Set up a way for a user to approve transfers of the
    // tokens using this contract

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
        _deliverTokens(sender, recipient, amount);
        return true;
    }

    /**
     * @dev Gets the total count of individual contributions stored by the
     * contract for a given recipient
     * @return uint256 representing the total amount of tokens
     */
    function getContributionCount(string memory nickname)
        public
        view
        returns (uint256)
    {
        address recipient = getRecipientAddress(nickname);
        return _contributionAmounts[recipient].length;
    }

    // Single-value getters

    function getContributorAtIndex(string memory nickname, uint256 index)
        public
        view
        returns (address senderAddress)
    {
        address[] memory senderAddresses = listContributors(nickname);
        return senderAddresses[index];
    }

    function getAmountAtIndex(string memory nickname, uint256 index)
        public
        view
        returns (uint256 contributionAmount)
    {
        uint256[] memory contributionAmounts = listAmounts(nickname);
        return contributionAmounts[index];
    }

    // List getters

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

    function _deliverTokens(
        address sender,
        address recipient,
        uint256 tokenAmount
    ) internal {
        // TODO: Debug this next
        //          Error: VM Exception while processing transaction: revert SafeERC20: low-level call failed
        //   at Contributions.callOptionalReturn (@openzeppelin/contracts/token/ERC20/SafeERC20.sol:68)
        //   at Contributions.safeTransferFrom (@openzeppelin/contracts/token/ERC20/SafeERC20.sol:25)
        //   at Contributions._deliverTokens (contracts/Contributions.sol:146)
        // token().safeTransferFrom(sender, recipient, tokenAmount);
        token().transferFrom(sender, recipient, tokenAmount);
    }
}
