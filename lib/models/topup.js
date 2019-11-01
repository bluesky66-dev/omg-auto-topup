const mongoose = require('mongoose')
const Joi = require('joi')

const topupSchema = new mongoose.Schema({
  snowflake_id: Number,
  topup_wallet: String,
  topup_pk: String,
  last_checked: Date,
}, {
  toJSON: true,
})

//define compound indexes in the schema
topupSchema.index({
  snowflake_id: 1
})

function validateTopup (snowFlakeID) {
  const schema = {
    snowFlakeID: Joi.number().required()
  }

  return Joi.validate(snowFlakeID, topupSchema)
}

const Topup = mongoose.model('Topup', topupSchema)

exports.Topup = Topup
exports.validateTopup = validateTopup