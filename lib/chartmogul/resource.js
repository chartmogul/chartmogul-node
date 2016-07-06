"use strict";

const ChartMogul = require("../chartmogul.js");
const errors = require('./errors');

const request = require("request").defaults({
  baseUrl: ChartMogul.API_BASE,
  headers: {
    'User-Agent': 'chartmogul-node/' + ChartMogul.VERSION
  }
});

const mappings = {
  all: 'GET',
  create: 'POST'
};

class Resource {

  static all(config, qs) {
    return this.request(config, mappings.all, this.path, qs);
  }
  static create() {

  }

  static request(config, method, uri, qs, body) {
    return new Promise((resolve, reject) => {
      // todo: check config type

      const options = {
        qs,
        uri,
        body,
        method,
        auth: {
          user: config.getAccountToken(),
          pass: config.getSecretKey(),
          sendImmediately: true
        }
      };

      request(options, (error, response, body) => {
        // console.log(error, response, body);
        if (error)
          return reject(error);

        // Parse JSON
        try {
          body = JSON.parse(body);
        } catch (e) {}

        switch (response.statusCode) {
          case 400:
            reject(new errors.SchemaInvalidError(
              "JSON schema validation hasn't passed.",
              response.statusCode,
              body
            ));
            break;
          case 403:
            reject(new errors.ForbiddenError(
              "The requested action is forbidden.",
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
          case 200:
          case 201:
          case 202:
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

module.exports = Resource;
