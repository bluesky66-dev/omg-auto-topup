/**
 * This file contains winston configuration
 */

const appRoot = require('app-root-path')
const Winston = require('winston')

/**
 * define the custom settings for each transport (file, console)
 * @type {{console: {handleExceptions: boolean, colorize: boolean, level: string, json: boolean}, file: {filename: string, handleExceptions: boolean, colorize: boolean, level: string, json: boolean, maxsize: number, maxFiles: number}}}
 */
const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
}

/**
 * Logger instance for winston logger
 * @type {winston.Logger}
 */
const logger = new Winston.createLogger({
  transports: [
    new Winston.transports.File(options.file),
    new Winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
})

/** I'm defining a stream function that will be able to get morgan-generated output into the winston log files.
 * I decided to use the info level so the output will be picked up by both transports (file and console)
 */

/**
 * create a stream object with a 'write' function that will be used by `morgan`
 * @type {{write(*=, *): void}}
 */
logger.stream = {
  write (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message)
  }
}

module.exports = logger