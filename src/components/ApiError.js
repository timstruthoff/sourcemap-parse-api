/**
 * Error which will be returned in a http response.
 */
module.exports = class ApiError extends Error {
  /**
   *
   * @param {Object} data[] The contents of the error.
   * @param {String} data[].message Short and general error message.
   * @param {String} data[].developerMessage Short and general error message.
   * @param {Object} data[].code Identifier of the error. Must be five characters long and start with an uppercase E letter. After that, there should be four numbers.
   * @param {Object} data[].statusCode Valid HTTP status code. This will be the status code of the error http response.
   */
  constructor({ message, developerMessage, code, statusCode = 500 }) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.developerMessage = developerMessage;
  }
};
