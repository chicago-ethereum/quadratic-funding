pragma solidity ^0.5.15;
// needed to use structs everywhere before Solidity 0.6.x
// pragma experimental ABIEncoderV2;

import "@nomiclabs/buidler/console.sol";

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract EthChicagoQF is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // ERC20 basic token contract being held
    IERC20 private _token;

    mapping(address => address[]) private _backerAddresses;
    mapping(address => uint256[]) private _contributionAmounts;

    mapping(address => bool) private _approvedProjects;

    mapping(string => address) private _nicknames;

    // struct Contribution {
    //   address backer;
    //   address project;
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

    function getProjectAddress(string memory nickname)
        public
        view
        returns (address project)
    {
        return _nicknames[nickname];
    }

    function addProject(address project, string memory nickname)
        public
        onlyOwner
    {
        _approvedProjects[project] = true;
        _nicknames[nickname] = project;
    }

    function removeProject(string memory nickname) public onlyOwner {
        address project = getProjectAddress(nickname);
        _approvedProjects[project] = false;
        delete _nicknames[nickname];
    }

    // TODO: Set up a way for a user to approve transfers of the
    // tokens using this contract

    // TODO: Remove backer as arg and just use msg.sender

    function contribute(
        address backer,
        string memory projectNickname,
        uint256 amount
    ) public returns (bool) {
        console.log("contribute called in Solidity");
        require(amount > 0, "Contribution amount must be greater than 0");
        address project = getProjectAddress(projectNickname);
        require(_approvedProjects[project] == true, "Project must be approved");
        _backerAddresses[project].push(backer);
        _contributionAmounts[project].push(amount);
        // Transfer the token as an internal tx if ERC20 approved
        _deliverTokens(backer, project, amount);
        return true;
    }

    /**
     * @dev Gets the total count of individual contributions stored by the
     * contract for a given project
     * @return uint256 representing the total amount of tokens
     */
    function getContributionCount(string memory projectNickname)
        public
        view
        returns (uint256)
    {
        address project = getProjectAddress(projectNickname);
        return _contributionAmounts[project].length;
    }

    // Single-value getters

    function getBackerAtIndex(string memory projectNickname, uint256 index)
        public
        view
        returns (address backerAddress)
    {
        address[] memory backerAddresses = listBackers(projectNickname);
        return backerAddresses[index];
    }

    function getAmountAtIndex(string memory projectNickname, uint256 index)
        public
        view
        returns (uint256 contributionAmount)
    {
        uint256[] memory contributionAmounts = listAmounts(projectNickname);
        return contributionAmounts[index];
    }

    // List getters

    function listBackers(string memory projectNickname)
        public
        view
        returns (address[] memory backerAddresses)
    {
        address project = getProjectAddress(projectNickname);
        return _backerAddresses[project];
    }

    function listAmounts(string memory projectNickname)
        public
        view
        returns (uint256[] memory contributionAmounts)
    {
        address project = getProjectAddress(projectNickname);
        return _contributionAmounts[project];
    }

    function _deliverTokens(
        address backer,
        address project,
        uint256 tokenAmount
    ) internal {
        // TODO: Potentially move back to safeTransferFrom at some point
        // token().safeTransferFrom(backer, project, tokenAmount);
        token().transferFrom(backer, project, tokenAmount);
    }
}
