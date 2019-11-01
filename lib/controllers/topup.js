const TopUpServices = require('../services/topup');
const HydroServices = require('../services/hydro');
const dotenv = require('dotenv');
const { generateAddressResData } = require('../models/schema/walletBridge');
const { verifySnowFlakeID } = require('../utils/walletLib');
const logger = require('../utils/middlewares/logger');
const code = require('../constants/codes');
const message = require('../constants/messages');
const responseFormat = require('../utils/responseFormat');

dotenv.config();
let topUpServices, hydroServices;

/**
 * Controller for OMG Top Up
 */
class TopUpController {

  constructor () {
    topUpServices = new TopUpServices();
    hydroServices = new HydroServices();
  }

  /**
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  static async generateWallet (req, res) {
    const { apiKey } = req.body;
    const { snowFlakeID } = req.params;
    let data = {};

    //check if the apikey matches with the static one
    if (apiKey !== process.env.API_KEY) {
      data = {
        res, code: code.UNAUTHORIZED,
        status: message.FAILED,
        message: message.UNAUTHORIZED,
      };

      return responseFormat.handleFail(data, generateAddressResData);
    }
    try {
      let [{ wallet, omg_created, topup_created }, hydroWallet] = await Promise.all([topUpServices.validateTopUpWallet({ snowFlakeID }),
        hydroServices.retrieveHydroWallet({ snowFlakeID })]);
      if (omg_created && topup_created) {
        data = {
          res, status: message.SUCCESS,
          code: code.OK, data: {
            topupWallet: wallet.topup_wallet
          }
        };
        return responseFormat.handleSuccess(data, generateAddressResData);
      } else if (!wallet || !omg_created) { //omg_wallet is null
        if (!topup_created) {
          const hydro_wallet_data = await hydroServices.retrieveHydroPK({
            snowflake_id: snowFlakeID,
            topup_wallet: hydroWallet.topup_wallet
          });
          wallet.topup_wallet = hydro_wallet_data.topup_wallet;
          wallet.topup_pk = hydro_wallet_data.topup_pk;
        }
        //check if snowFlakeID does exist in the ERC-1484 contract
        const snowFlakeIDExistInContract = await verifySnowFlakeID(snowFlakeID);
        if (snowFlakeIDExistInContract) {
          const transaction = await hydroServices.depositOverOMG({
            snowflake_id: snowFlakeID,
            topup_wallet: wallet.topup_wallet,
            topup_pk: wallet.topup_pk
          });
          await topUpServices.generateTopUpWallet({
            snowflake_id: snowFlakeID,
            topup_wallet: wallet.topup_wallet, //also the public key
            topup_pk: wallet.topup_pk,
            omg_linked: !!transaction,
            last_checked: Date.now(),
          });

          data = {
            res, status: message.SUCCESS,
            code: code.OK, data: {
              topupWallet: wallet.topup_wallet
            }
          };
          return responseFormat.handleSuccess(data, generateAddressResData);
        } else {
          data = {
            res,
            code: code.NOT_FOUND,
            status: message.FAILED,
            message: message.ID_NOT_FOUND,
          };
          return responseFormat.handleFail(data);
        }
      }
    } catch (error) {
      data = {
        res,
        code: code.BAD_REQUEST,
        status: message.ERROR,
        message: error.message,
        err: error
      };
      logger.error(error);
      return responseFormat.handleError(data);
    }

  }
}

module.exports = TopUpController;