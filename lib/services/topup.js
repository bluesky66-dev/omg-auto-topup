const { walletBridge: omgTopUpModel } = require('../models/walletBridge');

class TopUpServices {
  constructor () {
    this.omgTopUpModel = omgTopUpModel;
  }

  async validateTopUpWallet (params) {
    const { snowFlakeID: snowflake_id } = params;
    let wallet = await this.omgTopUpModel.findOne({ snowflake_id });
    //if the snowFlakeID does exist in the DB
    if (wallet) {
      if (wallet.topup_wallet && wallet.omg_linked) {
        return { wallet, omg_created: true, topup_created: true };
      } else if (wallet.topup_wallet && !wallet.omg_linked) {
        return { wallet, omg_created: false, topup_created: true };
      } else if (!wallet.topup_wallet && wallet.omg_linked) {
        return { wallet, omg_created: true, topup_created: false };
      } else {
        return { wallet, omg_created: false, topup_created: false };
      }
    }

    return { omg_created: false, topup_created: false };
  }

  async generateTopUpWallet (data) {
    const user_ = new this.omgTopUpModel(data);
    return await user_.save();
  }
}

module.exports = TopUpServices;