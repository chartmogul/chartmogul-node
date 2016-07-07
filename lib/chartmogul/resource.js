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
  cancel: 'PATCH'
};

class Resource {

  static request (config, method, uri, data) {
    return new Promise((resolve, reject) => {
      if (!(config instanceof Config)) {
        return reject(new errors.ConfigurationError(
          'First argument should be instance of ChartMogul.Config class'
        ));
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
          return reject(error);
        }

        switch (response.statusCode) {
          case 400:
            reject(new errors.SchemaInvalidError(
              "JSON schema validation hasn't passed.",
              response.statusCode,
              body
            ));
            break;
          case 401: case 403:
            reject(new errors.ForbiddenError(
              'The requested action is forbidden.',
              response.statusCode,
              body
            ));
            break;
          case 404:
            reject(new errors.NotFoundError(
              `The requested ${this.name} could not be found.`,
              response.statusCode,
              body
            ));
            break;
          case 422:
            reject(new errors.ResourceInvalidError(
              `The ${this.name}  could not be created or updated.`,
              response.statusCode,
              body
            ));
            break;
          case 200:case 201:case 202:case 204:
            resolve(body);
            break;
          default:
            reject(new errors.ChartMogulError(
              `${this.name} request error has occurred.`,
              response.statusCode,
              body
            ));
            break;
        }
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
    let data = util.getDataFromArgument(args);
    let path = util.expandPath(this.path, args);

    return this.request(config, verb, path, data);
  };
});

module.exports = Resource;
