const BigNumber = require('bignumber.js');
const Web3 = require('web3');
require('dotenv').config();
const { RootChain, ChildChain, OmgUtil } = require('@omisego/omg-js');
const { transaction } = OmgUtil;
const wait = require('./wait');

// setup for only 1 transaction confirmation block for fast confirmations
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT), null, { transactionConfirmationBlocks: 1 });

const rootChain = new RootChain(web3, process.env.PLASMA_CONTRACT_ADDRESS);
const childChain = new ChildChain(process.env.WATCHER_URL);

async function depositEthIntoPlasmaContract (userAddress, userPrivateKey, amount) {
  let rootChainBalance = await web3.eth.getBalance(userAddress);
  console.log(`User's rootchain balance: ${rootChainBalance}`);

  let childChainBalanceArray = await childChain.getBalance(userAddress);

  const childChainBal = childChainBalanceArray.length === 0 ? 0 : childChainBalanceArray[0].amount;
  console.log(`User's childchain balance: ${childChainBal}`);

  const depositAmount = BigNumber(web3.utils.toWei(amount || rootChainBalance - childChainBal, 'ether'));
  const depositTransaction = transaction.encodeDeposit(userAddress, depositAmount, transaction.ETH_CURRENCY);

  console.log(`Depositing ${web3.utils.fromWei(depositAmount.toString(), 'ether')} ETH from the rootchain to the childchain`);
  console.log(`Awaiting rootChain.depositEth()...`);

  // deposit ETH into the Plasma contract
  const transactionReceipt = await rootChain.depositEth(depositTransaction, depositAmount, {
    from: userAddress,
    privateKey: userPrivateKey
  });

  console.log(`Finished awaiting rootChain.depositEth()`);
  console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt, undefined, 2)}`);

  // wait for transaction to be recorded by the watcher
  console.log(`Waiting for transaction to be recorded by the watcher...`);
  await wait.waitForTransaction(web3, transactionReceipt.transactionHash, process.env.MILLIS_TO_WAIT_FOR_NEXT_BLOCK, process.env.BLOCKS_TO_WAIT_FOR_TXN);

  rootChainBalance = await web3.eth.getBalance(userAddress);
  console.log(`User's new rootchain balance: ${rootChainBalance}`);

  childChainBalanceArray = await childChain.getBalance(userAddress);
  console.log(`User's new childchain balance: ${childChainBalanceArray.length === 0 ? 0 : childChainBalanceArray[0].amount}`);

  return childChainBalanceArray;
}

module.exports = { depositEthIntoPlasmaContract };
