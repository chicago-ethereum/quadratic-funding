
abi = [{
  "anonymous": False,
  "inputs": [
    {
      "indexed": True,
      "internalType": "address",
      "name": "previousOwner",
      "type": "address"
    },
    {
      "indexed": True,
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  "name": "OwnershipTransferred",
  "type": "event"
},
{
  "constant": False,
  "inputs": [
    {
      "internalType": "address",
      "name": "project",
      "type": "address"
    },
    {
      "internalType": "string",
      "name": "nickname",
      "type": "string"
    }
  ],
  "name": "addProject",
  "outputs": [],
  "payable": False,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": False,
  "inputs": [
    {
      "internalType": "string",
      "name": "projectNickname",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "contribute",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "payable": False,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": True,
  "inputs": [
    {
      "internalType": "string",
      "name": "projectNickname",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    }
  ],
  "name": "getAmountAtIndex",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "contributionAmount",
      "type": "uint256"
    }
  ],
  "payable": False,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": True,
  "inputs": [
    {
      "internalType": "string",
      "name": "projectNickname",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    }
  ],
  "name": "getBackerAtIndex",
  "outputs": [
    {
      "internalType": "address",
      "name": "backerAddress",
      "type": "address"
    }
  ],
  "payable": False,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": True,
  "inputs": [
    {
      "internalType": "string",
      "name": "projectNickname",
      "type": "string"
    }
  ],
  "name": "getContributionCount",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "payable": False,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": True,
  "inputs": [
    {
      "internalType": "string",
      "name": "nickname",
      "type": "string"
    }
  ],
  "name": "getProjectAddress",
  "outputs": [
    {
      "internalType": "address",
      "name": "project",
      "type": "address"
    }
  ],
  "payable": False,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": True,
  "inputs": [],
  "name": "isOwner",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "payable": False,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": True,
  "inputs": [
    {
      "internalType": "string",
      "name": "projectNickname",
      "type": "string"
    }
  ],
  "name": "listAmounts",
  "outputs": [
    {
      "internalType": "uint256[]",
      "name": "contributionAmounts",
      "type": "uint256[]"
    }
  ],
  "payable": False,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": True,
  "inputs": [
    {
      "internalType": "string",
      "name": "projectNickname",
      "type": "string"
    }
  ],
  "name": "listBackers",
  "outputs": [
    {
      "internalType": "address[]",
      "name": "backerAddresses",
      "type": "address[]"
    }
  ],
  "payable": False,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": True,
  "inputs": [],
  "name": "owner",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "payable": False,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": False,
  "inputs": [
    {
      "internalType": "string",
      "name": "nickname",
      "type": "string"
    }
  ],
  "name": "removeProject",
  "outputs": [],
  "payable": False,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": False,
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "payable": False,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": False,
  "inputs": [
    {
      "internalType": "contract IERC20",
      "name": "token",
      "type": "address"
    }
  ],
  "name": "setToken",
  "outputs": [],
  "payable": False,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": True,
  "inputs": [],
  "name": "token",
  "outputs": [
    {
      "internalType": "contract IERC20",
      "name": "",
      "type": "address"
    }
  ],
  "payable": False,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": False,
  "inputs": [
    {
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  "name": "transferOwnership",
  "outputs": [],
  "payable": False,
  "stateMutability": "nonpayable",
  "type": "function"
}]
