const Joi = require('@hapi/joi')

/**
 * To Validate Body if any in request
 * @param schema
 * @param property
 * @returns {Function}
 */
exports.requestBodyValidation = (schema, property) => {
  return (req, res, next) => {
    const { error, value } = Joi.validate(req.body, schema)
    const valid = error == null

    if (valid) {
      req.body = value
      next()
    } else {
      const { details } = error
      const message = details.map(i => i.message).join(',')

      console.log('error', message)
      res.status(422).json({ status: false, message: 'Invalid Request In Route Parameters', error: message })
    }
  }
}

/**
 * To Validate In Route Params if any in request
 * @param schema
 * @param property
 * @returns {Function}
 */
exports.requestParamsValidation = (schema, property) => {
  return (req, res, next) => {
    const { error, value } = Joi.validate(req.params, schema)
    const valid = error == null

    if (valid) {
      req.params = value
      next()
    } else {
      const { details } = error
      const message = details.map(i => i.message).join(',')

      console.log('error', message)
      res.status(422).json({ status: false, message: 'Invalid Request Body', error: message })
    }
  }
}

/**
 * To Validate Query Params if any in request
 * @param schema
 * @param property
 * @returns {Function}
 */
exports.requestQueryValidation = (schema, property) => {
  return (req, res, next) => {
    const { error, value } = Joi.validate(req.query, schema)
    const valid = error == null

    if (valid) {
      req.query = value
      next()
    } else {
      const { details } = error
      const message = details.map(i => i.message).join(',')

      console.log('error', message)
      res.status(422).json({ status: false, message: 'Invalid Request Query parameters', error: message })
    }
  }
}

/**
 * To Validate Response to be sent from API
 * @param schema
 * @param data
 * @returns {Function}
 */
exports.responseValidation = (schema, data) => {
  return (req, res, next) => {
    const { error, value } = Joi.validate(data, schema)
    const valid = error == null

    if (valid) {
      res.status(200).json(value)
    } else {
      const { details } = error
      const message = details.map(i => i.message).join(',')

      console.log('error', message)
      res.status(422).json({ status: false, message: 'Invalid Response', error: message })
    }
  }
}
