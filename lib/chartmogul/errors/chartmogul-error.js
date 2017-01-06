'use strict';

class ChartMogulError extends Error {
  constructor (message, httpStatus, response) {
    super(message + ' ' + JSON.stringify(response));
    this.name = this.constructor.name;
    this.response = response;
    this.httpStatus = httpStatus;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = ChartMogulError;
