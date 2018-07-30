'use strict';

const errors = require('./errors');
const request = require('request');
const retry = require('retry');
const util = require('./util');
const Config = require('./config');

// HTTP verb mapping
const mappings = {
  all: 'GET',
  create: 'POST',
  destroy: 'DELETE',
  cancel: 'PATCH',
  merge: 'PATCH',
  retrieve: 'GET',
  patch: 'PATCH',
  update: 'PUT',
  modify: 'PATCH',
  add: 'POST',
  remove: 'DELETE'
};

/* API Resource Class */
class Resource {
  /**
   * Callback
   * @callback requestCallback
   * @param {Object} error
   * @param {Object} body
   */
  /**
   * Makes a HTTP request and returns a promise
   * @param {Object} config  - Instance of ChartMogul.Config class
   * @param {string} method  - HTTP verb
   * @param {string} uri - Request URI
   * @param {Object} [data] - POST Data or GET Query Object
   * @param {requestCallback} [callback] - callback that handles the response
   * @returns {Object} - Promise
   */
  static request (config, method, uri, data, callback) {
    const promise = new Promise((resolve, reject) => {
      if (!(config instanceof Config)) {
        let error = new errors.ConfigurationError(
          'First argument should be instance of ChartMogul.Config class'
        );
        return reject(error);
      }

      let qs = method === 'GET' ? data : {};
      let body = method === 'GET' ? {} : data;

      const options = {
        qs,
        uri,
        body,
        method,
        auth: {
          user: config.getAccountToken(),
          pass: config.getSecretKey(),
          sendImmediately: true
        },
        baseUrl: config.API_BASE,
        headers: {
          'User-Agent': 'chartmogul-node/' + config.VERSION
        },
        json: true
      };

      retryRequest(config.retries, options, (error, response, body) => {
        if (error) {
          return reject(error);
        }

        let err = null;
        switch (response.statusCode) {
          case 400:
            err = new errors.SchemaInvalidError(
              "JSON schema validation hasn't passed.",
              response.statusCode,
              body
            );
            break;
          case 401:
          case 403:
            err = new errors.ForbiddenError(
              'The requested action is forbidden.',
              response.statusCode,
              body
            );
            break;
          case 404:
            err = new errors.NotFoundError(
              `The requested ${this.name} could not be found.`,
              response.statusCode,
              body
            );
            break;
          case 422:
            err = new errors.ResourceInvalidError(
              `The ${this.name}  could not be created or updated.`,
              response.statusCode,
              body
            );
            break;
          case 200:
          case 201:
          case 202:
          case 204:
            break;
          default:
            err = new errors.ChartMogulError(
              `${this.name} request error has occurred.`,
              response.statusCode,
              body
            );
            break;
        }
        if (err) {
          return reject(err);
        }
        resolve(body);
      });
    });

    if (callback && typeof callback === 'function') {
      promise.then(callback.bind(null, null), callback);
      return;
    }

    return promise;
  }

  static _method (verb, pathOverride) {
    return function (config) {
      // node v4.x doesn't support rest param
      let args = Array.from(arguments).splice(1);
      let cb, data;
      if (typeof args[args.length - 1] === 'function') {
        cb = args.pop();
      }
      if (typeof args[args.length - 1] === 'object') {
        data = args.pop();
      }
      let path = util.expandPath(pathOverride || this.path, args);

      return this.request(config, verb, path, data, cb);
    };
  }
}

// Define actions
Object.keys(mappings).forEach(methodName => {
  Resource[methodName] = Resource._method(mappings[methodName]);
});

function retryOnStatus (res) {
  if (
    res &&
    (res.statusCode === 429 || (res.statusCode >= 500 && res.statusCode < 600))
  ) {
    return new Error(`${res.statusCode} - ${res.statusMessage}`);
  }
}

// ref: https://github.com/FGRibreau/node-request-retry/blob/master/strategies/NetworkError.js#L3:22
var RETRIABLE_ERRORS = [
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

function retryRequest (retries, options, cb) {
  if(retries === undefined){
    retries = 20 // default is around 15min
  }

  // disable retrying
  if (retries === 0) {
    return request(options, cb);
  }

  var operation = retry.operation({
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
}

module.exports = Resource;
