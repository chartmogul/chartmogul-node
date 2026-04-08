'use strict';

const errors = require('./errors');
const util = require('./util');
const Config = require('./config');

class Upload {
  static create (config, dataSourceUuid, data, callback) {
    const promise = new Promise((resolve, reject) => {
      if (!(config instanceof Config)) {
        const error = new errors.ConfigurationError(
          'First argument should be instance of ChartMogul.Config class'
        );
        return reject(error);
      }

      const uri = `/v1/data_sources/${dataSourceUuid}/uploads`;

      const formData = {};
      if (data.file) formData.file = data.file;
      if (data.type) formData.type = data.type;
      if (data.batch_name) formData.batch_name = data.batch_name;

      const options = {
        uri,
        method: 'POST',
        formData,
        qs: {},
        auth: {
          user: config.getApiKey(),
          pass: '',
          sendImmediately: true
        },
        baseUrl: config.API_BASE,
        headers: {
          'User-Agent': 'chartmogul-node/' + config.VERSION
        }
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
              'The requested Upload could not be found.',
              response.statusCode,
              body
            );
            break;
          case 422:
            err = new errors.ResourceInvalidError(
              'The Upload could not be created or updated.',
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
              'Upload request error has occurred.',
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
}

module.exports = Upload;
