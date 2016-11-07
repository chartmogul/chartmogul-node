'use strict';

const Resource = require('../resource.js');

class Customer extends Resource {

  static get path () {
    return '/v1/import/customers{/customerUuid}';
  }

  // @Override
  static patch (config, customerUuid, data, callback) {
    return this.request(
      config,
      'PATCH',
      `/v1/import/customers/${customerUuid}`,
      data,
      callback
    );
  }
}

module.exports = Customer;
