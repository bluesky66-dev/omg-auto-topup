const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const autocheckSchema = new mongoose.Schema({
  snowflake_id: Number,
  transaction_id: String,
  amount: Number,
  status: { type: Number, min: 0, max: 3, required: true },
  timestamp: Date,
});

//define compound indexes in the schema
autocheckSchema.index({
  snowflake_id: 1
});

function validateAutoCheck (snowFlakeID, amount, status) {
  const schema = {
    snowFlakeID: Joi.number().required(),
    amount: Joi.number().required(),
    status: Joi.number().required()
  };

  return Joi.validate(snowFlakeID, amount, status, autocheckSchema);
}

const AutoCheck = mongoose.model('omg_wallets_topup', autocheckSchema);

exports.AutoCheck = AutoCheck;
exports.validateAutoCheck = validateAutoCheck;
