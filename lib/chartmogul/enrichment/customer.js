'use strict';

const Resource = require('../resource.js');
const util = require('../util');

class Customer extends Resource {

  static get path () {
    return '/v1/customers{/customerUuid}{/attributes}';
  }

  static search (config, query, callback) {
    let path = util.expandPath(this.path, ['search']);
    return Resource.request(config, 'GET', path, query, callback);
  }

  static attributes (config, customerId, callback) {
    let path = util.expandPath(this.path, [customerId, 'attributes']);
    return Resource.request(config, 'GET', path, {}, callback);
  }

}

module.exports = Customer;
