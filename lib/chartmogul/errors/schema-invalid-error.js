'use strict';
const ChartMogulError = require('./chartmogul-error');

class SchemaInvalidError extends ChartMogulError {
  constructor (message, httpStatus, response) {
    super(message, httpStatus, response);
    Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = SchemaInvalidError;
