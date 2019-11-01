const dotenv = require('dotenv');
const cryptoJS = require('crypto-js');
const request = require('request-promise');
const message = require('../constants/messages');
const { Topup: TopupModel } = require('../models/topup');
const { depositEthIntoPlasmaContract } = require('../utils/omg-deposit');
dotenv.config();

class HydroService {
  constructor () {
    this.hydroWalletUrl = process.env.SFAT_URL;
    this.hydroKey = process.env.API_KEY;
  }

  async retrieveHydroWallet (params) {
    const { snowFlakeID } = params;
    const result = await request({
      uri: `${this.hydroWalletUrl}topup/generate_address`,
      method: 'POST', qs: { snowFlakeID }, json: true,
      body: JSON.stringify({ apiKey: this.hydroKey }),
    });

    if (result.status === message.SUCCESS) {
      return result.data;
    }

    return undefined;
  }

  async retrieveHydroPK (params) {
    const { snowflake_id, topup_wallet } = params;
    return await TopupModel.findOne({ snowflake_id, topup_wallet });
  }

  async depositOverOMG (params) {
    const { snowflake_id, topup_wallet, topup_pk, amount } = params;
    const seed = process.env.SERVER_SEED + '_' + snowflake_id;
    const private_key = cryptoJS.AES.decrypt(topup_pk, seed).toString();
    return await (depositEthIntoPlasmaContract(topup_wallet, private_key, amount));
  }
}

module.exports = HydroService;