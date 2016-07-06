'use strict';
const ChartMogulError = require('./chartmogul-error');

class ResourceInvalidError extends ChartMogulError {
  constructor (message, httpStatus, response) {
    super(message, httpStatus, response);
    Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = ResourceInvalidError;
