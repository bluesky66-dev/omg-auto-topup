const Joi = require('@hapi/joi');
exports.generateAddressParams = Joi.object().keys({
  snowFlakeID: Joi.number().required(),
});

exports.generateAddressBody = Joi.object().keys({
  apiKey: Joi.string().required(),
});

exports.generateAddressResData = Joi.object().keys({
  data: Joi.object().keys({
    topupWallet: Joi.string(),
  }), status: Joi.string().valid('success', 'failed', 'error'),
  message: Joi.string().default('Successful').required(),
}).options({ stripUnknown: { objects: true, arrays: true } });
