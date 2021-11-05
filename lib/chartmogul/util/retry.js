'use strict';

const request = require('request');
const retry = require('retry');

function retryOnStatus (res) {
  if (
    res &&
    (res.statusCode === 429 || (res.statusCode >= 500 && res.statusCode < 600))
  ) {
    return new Error(`${res.statusCode} - ${res.statusMessage}`);
  }
}

// ref: https://github.com/FGRibreau/node-request-retry/blob/master/strategies/NetworkError.js#L3:22
const RETRIABLE_ERRORS = [
  'ECONNRESET',
  'ENOTFOUND',
  'ESOCKETTIMEDOUT',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'EHOSTUNREACH',
  'EPIPE',
  'EAI_AGAIN'
];

function retryOnNetworkError (err) {
  if (err && RETRIABLE_ERRORS.indexOf(err.code) > -1) {
    return err;
  }
  return null;
}

module.exports = function retryRequest (retries, options, cb) {
  if (retries === undefined) {
    retries = 20; // default is around 15min
  }

  const operation = retry.operation({
    retries,
    randomize: 0.5,
    minTimeout: 500,
    maxTimeout: 60 * 1000
  });
  operation.attempt(function (currentAttempt) {
    request(options, (err, res, body) => {
      if (operation.retry(retryOnStatus(res) || retryOnNetworkError(err))) {
        return;
      }
      cb(err, res, body);
    });
  });
};
