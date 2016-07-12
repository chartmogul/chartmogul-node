'use strict';

const Resource = require('../resource.js');

class Customer extends Resource {

  static get path () {
    return '/v1/import/customers{/customerUuid}';
  }
}

module.exports = Customer;
