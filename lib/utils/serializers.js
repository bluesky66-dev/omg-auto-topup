/**
 * Prevents passwords, credit card details etc from being logged.
 * @param password
 * @param body HTTP request body
 * @returns {*}
 */
const removeSensitiveData = ({ password, ...body }) => body

/**
 * Serializes an Express request for Bunyan logging
 * @param req Express request object
 * @returns {{[p: string]: *}|*}
 */
exports.reqSerializer = (req) => {
  if (!req || !req.connection) return req

  return {
    method: req.method,
    url: req.url,
    headers: req.headers,
    origin_service: req.headers['x-origin-service'],
    remoteAddress: req.connection.remoteAddress,
    remotePort: req.connection.remotePort,
    request_id: req.id,
    ...(req.body || Object.keys(req.body).length !== 0
      ? { body: removeSensitiveData(req.body) }
      : undefined),
  }
}