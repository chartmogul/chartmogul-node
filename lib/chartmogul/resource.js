'use strict';

const errors = require('./errors');
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
        const error = new errors.ConfigurationError(
          'First argument should be instance of ChartMogul.Config class'
        );
        return reject(error);
      }

      const qs = method === 'GET' ? data : {};
      const body = method === 'GET' ? {} : data;

      const options = {
        qs,
        uri,
        body,
        method,
        auth: {
          user: config.getAccountToken(),
          pass: "",
          sendImmediately: true
        },
        baseUrl: config.API_BASE,
        headers: {
          'User-Agent': 'chartmogul-node/' + config.VERSION
        },
        json: true
      };

      util.retryRequest(config.retries, options, (error, response, body) => {
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
      const args = Array.from(arguments).splice(1);
      let cb, data;
      if (typeof args[args.length - 1] === 'function') {
        cb = args.pop();
      }
      if (typeof args[args.length - 1] === 'object') {
        data = args.pop();
      }
      const path = util.expandPath(pathOverride || this.path, args);

      return this.request(config, verb, path, data, cb);
    };
  }
}

// Define actions
Object.keys(mappings).forEach(methodName => {
  Resource[methodName] = Resource._method(mappings[methodName]);
});

module.exports = Resource;
