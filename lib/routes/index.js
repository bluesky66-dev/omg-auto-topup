const express = require('express')
const { config } = require('dotenv')

const OMGTopUpController = require('../controllers/topup')
const { requestBodyValidation, requestParamsValidation, requestQueryValidation, responseValidation } = require(
  '../utils/middlewares/schemaValidator')
const { generateAddressParams, generateAddressBody, generateAddressResData } = require(
  '../models/schema/walletBridge')

const router = express.Router()
config()

router.post('/topup/generate_address/:snowflakeId', [
  requestParamsValidation(generateAddressParams),
  requestBodyValidation(generateAddressBody)], OMGTopUpController.generateWallet)

module.exports = router
