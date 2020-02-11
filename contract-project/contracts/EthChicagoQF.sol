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

    address[] private _projectAddressesArray;
    // string[] private _projectNicknamesArray;
    // Note: Not using an array of project nicknames since arrays
    // of strings are only an experimental feature in Solidity 0.5.x
    // and we're constrained to use 0.5.x because of OpenZeppelin

    // Mapping from project address to position in the _projectsAddressesArray
    mapping(address => uint256) private _projectAddressesArrayIndex;
    mapping(address => bool) private _approvedProjects;

    mapping(address => string) private _projectNicknames;
    mapping(string => address) private _projectAddresses;

    // Might use this approach in Solidity 0.6.x
    // Note: Choose project OR projectNickname
    // struct Contribution {
    //   address backer;
    //   address project;
    //   string projectNickname;
    //   uint256 amount;
    // }

    event NewContribution(address backer, address project, uint256 amount);

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
        return _projectAddresses[nickname];
    }

    function getProjectNickname(address projectAddress)
        public
        view
        returns (string memory nickname)
    {
        return _projectNicknames[projectAddress];
    }

    function addProject(address project, string memory nickname)
        public
        onlyOwner
    {
        _approvedProjects[project] = true;
        _projectAddresses[nickname] = project;
        _projectNicknames[project] = nickname;
        _projectAddressesArrayIndex[project] = _projectAddressesArray.length;
        _projectAddressesArray.push(project);
    }

    function removeProject(string memory nickname) public onlyOwner {
        address project = getProjectAddress(nickname);
        _approvedProjects[project] = false;
        delete _projectAddresses[nickname];
        delete _projectNicknames[project];
        // TODO: Remove project from dynamic array (non-trivial)
    }

    /**
     * @dev Private function to remove a project from this contract's project
     * tracking data structures. This has O(1) time complexity, but alters
     * the order of the _projectAddressesArray array.
     * @param project address of the project to be removed from the projects list
     */
    function _removeTokenFromAllProjectsEnumeration(address project) private {
        // To prevent a gap in the projects array, we store the last project in the
        // index of the project to delete, and then delete the last slot (swap and
        // pop).

        uint256 lastProjectIndex = _projectAddressesArray.length.sub(1);
        uint256 projectIndex = _projectAddressesArrayIndex[project];

        // When the project to delete is the last project, the swap operation is
        // unnecessary. However, this occurs rarely enough that we still do the
        // swap in that case to avoid the gas cost of adding an 'if' statement
        address lastProjectAddress = _projectAddressesArray[lastProjectIndex];

        // Move the last project to the slot of the to-delete project
        _projectAddressesArray[projectIndex] = lastProjectAddress;

        // Update the moved project's index
        _projectAddressesArrayIndex[lastProjectAddress] = projectIndex;

        // This also deletes the contents at the last position of the array
        _projectAddressesArray.length--;
        _projectAddressesArrayIndex[project] = 0;
    }

    function contribute(string memory projectNickname, uint256 amount)
        public
        returns (bool)
    {
        console.log("contribute called in Solidity");
        return contributeFrom(msg.sender, projectNickname, amount);
    }

    function contributeFrom(
        address backer,
        string memory projectNickname,
        uint256 amount
    ) public returns (bool) {
        require(amount > 0, "Contribution amount must be greater than 0");
        address project = getProjectAddress(projectNickname);
        require(_approvedProjects[project] == true, "Project must be approved");
        // TODO: Consider checking the insufficient
        // allowance or insufficient balance case here
        _backerAddresses[project].push(backer);
        _contributionAmounts[project].push(amount);
        // Transfer the token as an internal tx if ERC20 approved
        _deliverTokens(backer, project, amount);
        emit NewContribution(backer, project, amount);
        return true;
    }

    // Count getters
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

    function getProjectCount() public view returns (uint256) {
        return _projectAddressesArray.length;
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

    function getProjectNicknameAtIndex(uint256 index)
        public
        view
        returns (string memory nickname)
    {
        // Not using a list project nicknames function since arrays
        // of strings are only an experimental feature in Solidity 0.5.x
        address _projectAddress = _projectAddressesArray[index];
        string memory _nickname = getProjectNickname(_projectAddress);
        return _nickname;
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

    function listProjectAddresses()
        public
        view
        returns (address[] memory projectAddressesArray)
    {
        return _projectAddressesArray;
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
