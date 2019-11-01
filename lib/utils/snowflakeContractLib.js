const Web3 = require('web3');
const logger = require('./middlewares/logger');

require('dotenv').config();

const provider = new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT);

const web3 = new Web3(provider);

exports.web3 = web3;

const abi = [{
  'constant': true,
  'inputs': [],
  'name': 'raindropAddress',
  'outputs': [{ 'name': '', 'type': 'address' }],
  'payable': false,
  'stateMutability': 'view',
  'type': 'function'
}, {
  'constant': false,
  'inputs': [{ 'name': '_value', 'type': 'uint256' }, {
    'name': '_challenge',
    'type': 'uint256'
  }, { 'name': '_partnerId', 'type': 'uint256' }],
  'name': 'authenticate',
  'outputs': [],
  'payable': false,
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'constant': true,
  'inputs': [],
  'name': 'name',
  'outputs': [{ 'name': '', 'type': 'string' }],
  'payable': false,
  'stateMutability': 'view',
  'type': 'function'
}, {
  'constant': false,
  'inputs': [{ 'name': '_spender', 'type': 'address' }, { 'name': '_amount', 'type': 'uint256' }],
  'name': 'approve',
  'outputs': [{ 'name': 'success', 'type': 'bool' }],
  'payable': false,
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'constant': true,
  'inputs': [],
  'name': 'totalSupply',
  'outputs': [{ 'name': '', 'type': 'uint256' }],
  'payable': false,
  'stateMutability': 'view',
  'type': 'function'
}, {
  'constant': false,
  'inputs': [{ 'name': '_from', 'type': 'address' }, { 'name': '_to', 'type': 'address' }, {
    'name': '_amount',
    'type': 'uint256'
  }],
  'name': 'transferFrom',
  'outputs': [{ 'name': 'success', 'type': 'bool' }],
  'payable': false,
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'constant': true,
  'inputs': [{ 'name': '', 'type': 'address' }],
  'name': 'balances',
  'outputs': [{ 'name': '', 'type': 'uint256' }],
  'payable': false,
  'stateMutability': 'view',
  'type': 'function'
}, {
  'constant': true,
  'inputs': [],
  'name': 'decimals',
  'outputs': [{ 'name': '', 'type': 'uint8' }],
  'payable': false,
  'stateMutability': 'view',
  'type': 'function'
}, {
  'constant': false,
  'inputs': [{ 'name': '_value', 'type': 'uint256' }],
  'name': 'burn',
  'outputs': [],
  'payable': false,
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'constant': true,
  'inputs': [{ 'name': '', 'type': 'address' }, { 'name': '', 'type': 'address' }],
  'name': 'allowed',
  'outputs': [{ 'name': '', 'type': 'uint256' }],
  'payable': false,
  'stateMutability': 'view',
  'type': 'function'
}, {
  'constant': true,
  'inputs': [{ 'name': '_owner', 'type': 'address' }],
  'name': 'balanceOf',
  'outputs': [{ 'name': 'balance', 'type': 'uint256' }],
  'payable': false,
  'stateMutability': 'view',
  'type': 'function'
}, {
  'constant': true,
  'inputs': [],
  'name': 'owner',
  'outputs': [{ 'name': '', 'type': 'address' }],
  'payable': false,
  'stateMutability': 'view',
  'type': 'function'
}, {
  'constant': true,
  'inputs': [],
  'name': 'symbol',
  'outputs': [{ 'name': '', 'type': 'string' }],
  'payable': false,
  'stateMutability': 'view',
  'type': 'function'
}, {
  'constant': false,
  'inputs': [{ 'name': '_to', 'type': 'address' }, { 'name': '_amount', 'type': 'uint256' }],
  'name': 'transfer',
  'outputs': [{ 'name': 'success', 'type': 'bool' }],
  'payable': false,
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'constant': false,
  'inputs': [{ 'name': '_raindrop', 'type': 'address' }],
  'name': 'setRaindropAddress',
  'outputs': [],
  'payable': false,
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'constant': false,
  'inputs': [{ 'name': '_addressList', 'type': 'address[]' }, { 'name': '_amounts', 'type': 'uint256[]' }],
  'name': 'setBalances',
  'outputs': [],
  'payable': false,
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'constant': false,
  'inputs': [{ 'name': '_spender', 'type': 'address' }, { 'name': '_value', 'type': 'uint256' }, {
    'name': '_extraData',
    'type': 'bytes'
  }],
  'name': 'approveAndCall',
  'outputs': [{ 'name': 'success', 'type': 'bool' }],
  'payable': false,
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'constant': true,
  'inputs': [{ 'name': '_owner', 'type': 'address' }, { 'name': '_spender', 'type': 'address' }],
  'name': 'allowance',
  'outputs': [{ 'name': 'remaining', 'type': 'uint256' }],
  'payable': false,
  'stateMutability': 'view',
  'type': 'function'
}, {
  'constant': false,
  'inputs': [{ 'name': 'newOwner', 'type': 'address' }],
  'name': 'transferOwnership',
  'outputs': [],
  'payable': false,
  'stateMutability': 'nonpayable',
  'type': 'function'
}, { 'inputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'constructor' }, {
  'anonymous': false,
  'inputs': [{ 'indexed': true, 'name': '_from', 'type': 'address' }, {
    'indexed': true,
    'name': '_to',
    'type': 'address'
  }, { 'indexed': false, 'name': '_amount', 'type': 'uint256' }],
  'name': 'Transfer',
  'type': 'event'
}, {
  'anonymous': false,
  'inputs': [{ 'indexed': true, 'name': '_owner', 'type': 'address' }, {
    'indexed': true,
    'name': '_spender',
    'type': 'address'
  }, { 'indexed': false, 'name': '_amount', 'type': 'uint256' }],
  'name': 'Approval',
  'type': 'event'
}, {
  'anonymous': false,
  'inputs': [{ 'indexed': true, 'name': '_burner', 'type': 'address' }, {
    'indexed': false,
    'name': '_amount',
    'type': 'uint256'
  }],
  'name': 'Burn',
  'type': 'event'
}, {
  'anonymous': false,
  'inputs': [{ 'indexed': true, 'name': 'previousOwner', 'type': 'address' }, {
    'indexed': true,
    'name': 'newOwner',
    'type': 'address'
  }],
  'name': 'OwnershipTransferred',
  'type': 'event'
}];

/**
 * @description - Check Hydro Balance of account
 */
exports.checkHydroBalance = async (address) => {
  const contract = new web3.eth.Contract(abi, process.env.SNOWFLAKE_CONTRACT_ADDRESS);
  try {
    return await contract.methods.balanceOf(address).call(function (error, result) {
      if (!error)
        console.log('Balance: ' + result);
      else
        logger.error(error);
    });
  } catch (error) {
    logger.error(error);
  }
};