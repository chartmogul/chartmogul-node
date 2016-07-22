'use strict';

const Resource = require('../resource.js');

class Customer extends Resource {

  static get path () {
    return '/v1/customers{/customerUuid}{/attributes}';
  }

  static search (config, query, callback) {
    return this.retrieve(config, 'search', query, callback);
  }

  static attributes (config, customerId, callback) {
    return this.retrieve(config, customerId, 'attributes', callback);
  }

}

module.exports = Customer;
