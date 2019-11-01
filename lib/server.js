const { errorHandler } = require('./utils/middlewares/error')

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')

const cors = require('cors')
const compression = require('compression')
const flash = require('connect-flash')
const morgan = require('morgan')
const logger = require('./utils/middlewares/logger')

const app = express()
require('dotenv').config()
require('./utils/database')
/**
 * Pre Middleware Stack
 */

app.use(morgan('combined', { stream: logger.stream }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(cors())
app.use(compression())
app.use(flash())

/* Application Routes */
app.use('/v1/', require('./routes'))

/**
 * Post Middleware Stack
 */
app.use(errorHandler);

(async () => {
  await init()
})()

module.exports = app
