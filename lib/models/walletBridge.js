const mongoose = require('mongoose');

const walletBridgeSchema = new mongoose.Schema({
  snowflake_id: Number,
  topup_wallet: String,
  topup_pk: String,
  omg_linked: Boolean,
  last_checked: Date,
}, {
  toJSON: true,
});

//define compound indexes in the schema
walletBridgeSchema.index({
  snowflake_id: 1,
});

exports.walletBridge = mongoose.model('omg_wallets_bridge', walletBridgeSchema);
