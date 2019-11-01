const cryptoJS = require('crypto-js');
const { of } = require('await-of');
const logger = require('../../utils/middlewares/logger');
const { walletBridgeSchema: TopUpModel } = require('../../models/walletBridge');
const { checkHydroBalance } = require('../../utils/snowflakeContractLib');
const { depositEthIntoPlasmaContract } = require('../../utils/omg-deposit');

require('dotenv').config();

class WalletAutoCheck {
  static async check () {
    let [wallets, error] = await of(TopUpModel.find({}).sort('last_checked'));
    if (!wallets.length) {
      let message = 'No wallets for check';
      logger.info(message);
      return message;
    }

    for (let wallet of wallets) {
      logger.info(`Checking wallet ${wallet.topup_wallet}`);
      const balance = await checkHydroBalance(wallet.topup_wallet);
      logger.info(`Wallet balance is ${balance}`);
      if (balance >= process.env.CHECK_WALLET_HYDRO_BALANCE) {
        // decrypt private key
        const seed = process.env.SERVER_SEED + '_' + wallet.snowflake_id;
        const private_key = cryptoJS.AES.decrypt(wallet.topup_pk, seed).toString();
        await of(depositEthIntoPlasmaContract(wallet.topup_wallet, private_key));
      }
      let [, error] = await of(TopUpModel.updateOne({
        snowflake_id: wallet.snowflake_id,
        topup_wallet: wallet.topup_wallet,
        topup_pk: wallet.topup_pk
      }, { $set: { last_checked: Date.now() } }));
      logger.info(`last_checked timestamp has updated of topup wallet ${wallet.topup_wallet}`);
      if (error) {
        logger.error(error);
      }
    }
  }
}

module.exports = WalletAutoCheck;