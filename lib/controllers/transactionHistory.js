const dotenv = require('dotenv');
const _ = require('lodash');
const logger = require('../utils/middlewares/logger');
const code = require('../constants/codes');
const message = require('../constants/messages');
const Action = require('../constants/actions');
const responseFormat = require('../utils/responseFormat');
const { AutoCheck: AutoCheckModel, validateAutoCheck } = require('../models/autocheck');

const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

dotenv.config();
const API_KEY = process.env.API_KEY;

const STATUS_CODE = {
  'not_sent': 0,
  'pending': 1,
  'completed': 2
};

// Request data schema
const schema = {
  properties: {
    snowFlakeID: { type: 'number' },
    action: {
      enum: [
        Action.ALL,
        Action.PENDING,
        Action.COMPLETED,
      ]
    },
    page: { type: 'number', minimum: 1 },
    size: { type: 'number', maximum: 15 }
  },
  required: ['snowFlakeID', 'action', 'page', 'size']
};

class TransactionHistory {
  static async history (req, res) {

    const validate = ajv.compile(schema);
    const { apiKey, action, snowFlakeID, page, size } = req.body;
    let data = {};

    //check if the apikey matches with the static one
    if (apiKey !== API_KEY) {
      data = {
        res,
        code: code.UNAUTHORIZED,
        status: message.FAILED,
        message: message.UNAUTHORIZED,
      };
      logger.error(message.UNAUTHORIZED);
      return responseFormat.handleFail(data);
    }

    // Validate the request or query params
    const valid_schema = validate(req.body);
    if (!valid_schema) {
      data = {
        res,
        code: code.UNPROCESSED_ENTITY,
        status: message.FAILED,
        message: ajv.errorsText(validate.errors),
      };
      logger.error(ajv.errorsText(validate.errors));
      return responseFormat.handleFail(data);
    }

    const skip = size * page - size;
    let transactions, count, content;

    if (action === Action.ALL) {
      transactions = await AutoCheckModel.find({ snowflake_id: snowFlakeID }).sort('timestamp').skip(skip).limit(size);
      count = await AutoCheckModel.find({ snowflake_id: snowFlakeID }).count();
      const pending_transactions = _.filter(transactions, (transaction) => !_.includes([STATUS_CODE.not_sent, STATUS_CODE.completed], transaction.status));
      const completed_transactions = _.filter(transactions, (transaction) => !_.includes([STATUS_CODE.not_sent, STATUS_CODE.pending], transaction.status));
      const not_sent_transactions = _.filter(transactions, (transaction) => !_.includes([STATUS_CODE.pending, STATUS_CODE.completed], transaction.status));
      content = { pending: pending_transactions, completed: completed_transactions, not_sent: not_sent_transactions };
    } else if (action === Action.PENDING) {
      transactions = await AutoCheckModel.find({
        snowflake_id: snowFlakeID,
        status: STATUS_CODE.pending
      }).sort('timestamp').skip(skip).limit(size);
      count = await AutoCheckModel.find({ snowflake_id: snowFlakeID, status: STATUS_CODE.pending }).count();
      content = { pending: transactions };
    } else {
      transactions = await AutoCheckModel.find({
        snowflake_id: snowFlakeID,
        action: STATUS_CODE.completed
      }).sort('timestamp').skip(skip).limit(size);
      count = await AutoCheckModel.find({ snowflake_id: snowFlakeID, status: STATUS_CODE.completed }).count();
      content = { completed: transactions };
    }

    data = {
      res,
      status: message.SUCCESS,
      code: code.OK,
      data: {
        metadata: {
          per_page: size,
          page: page,
          page_count: transactions.length ? Math.ceil(count / size) : 0,
          total_count: count,
          first: (page === 1),
          last: (page * size >= count)
        },
        transactions: content
      }
    };
    return responseFormat.handleSuccess(data);
  }

}

module.exports = TransactionHistory;