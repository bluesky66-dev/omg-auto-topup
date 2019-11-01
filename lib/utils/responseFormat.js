/**
 * Class for formatting response
 */
class ResponseFormat {

  /**
   * Handle Success Function
   * @param obj
   * @returns {*}
   */
  static handleSuccess (obj) {
    const { res, status, code, data } = obj
    return res.status(code).json({
      status,
      data
    })
  }

  /**
   * Handle Error Function
   * @param obj
   * @returns {*}
   */
  static handleError (obj) {
    const { res, status, code, err, message } = obj
    return res.status(code).json({
      status,
      message,
      err
    })
  }

  /**
   * Handle Failure Function
   * @param obj
   * @returns {*}
   */
  static handleFail (obj) {
    const { res, status, code, message } = obj
    return res.status(code).json({
      status,
      message
    })
  }
}

module.exports = ResponseFormat