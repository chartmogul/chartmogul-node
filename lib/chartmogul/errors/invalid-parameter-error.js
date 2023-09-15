'use strict';

const ChartMogulError = require('./chartmogul-error');

class InvalidParameterError extends ChartMogulError {
  constructor (message, httpStatus, response) {
    super(message, httpStatus, response);
    Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = InvalidParameterError;
