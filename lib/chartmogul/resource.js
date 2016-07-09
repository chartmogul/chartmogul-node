'use strict';

const errors = require('./errors');
const request = require('request');
const util = require('./util');
const Config = require('./config');

// HTTP verb mapping
const mappings = {
  all: 'GET',
  create: 'POST',
  destroy: 'DELETE',
  cancel: 'PATCH',
  retrieve: 'GET',
  update: 'PUT',
  add: 'POST',
  remove: 'DELETE'
};

/* API Resource Class*/
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
    callback = callback || function () {};

    return new Promise((resolve, reject) => {
      if (!(config instanceof Config)) {
        let error = new errors.ConfigurationError(
          'First argument should be instance of ChartMogul.Config class'
        );
        callback(error, null);
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
      // console.log(options);
      request(options, (error, response, body) => {
        // console.log(error, response, body);
        if (error) {
          callback(error, null);
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
          case 401: case 403:
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
          case 200:case 201:case 202:case 204:
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
          callback(err, null);
          return reject(err);
        }
        callback(null, body);
        resolve(body);
      });
    });
  }
}

// Define actions
Object.keys(mappings).forEach(methodName => {
  let verb = mappings[methodName];
  Resource[methodName] = function (config) {
    // node v4.x doesn't support rest param
    let args = Array.from(arguments).splice(1);
    let cb, data;
    if (typeof args[args.length - 1] === 'function') {
      cb = args.pop();
    }
    if (typeof args[args.length - 1] === 'object') {
      data = args.pop();
    }
    let path = util.expandPath(this.path, args);

    return this.request(config, verb, path, data, cb);
  };
});

module.exports = Resource;
