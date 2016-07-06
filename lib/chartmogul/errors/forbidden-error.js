'use strict';
const ChartMogulError = require('./chartmogul-error');

class ForbiddenError extends ChartMogulError {
  constructor (message, httpStatus, response) {
    super(message, httpStatus, response);
    Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = ForbiddenError;
