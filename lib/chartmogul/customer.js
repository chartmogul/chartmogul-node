'use strict';

const Resource = require('./resource');
const util = require('./util');

class Customer extends Resource {
  static get path () {
    return '/v1/customers{/customerUuid}{/attributes}';
  }

  static search (config, query, callback) {
    const path = util.expandPath(this.path, ['search']);
    return Resource.request(config, 'GET', path, query, callback);
  }

  static attributes (config, customerId, callback) {
    const path = util.expandPath(this.path, [customerId, 'attributes']);
    return Resource.request(config, 'GET', path, {}, callback);
  }
}

// @Override
Customer.modify = Resource._method('PATCH', '/v1/customers/{customerUuid}');

Customer.merge = Resource._method('POST', '/v1/customers/merges');

Customer.connectSubscriptions = Resource._method('POST', '/v1/customers/{customerUuid}/connect_subscriptions');

module.exports = Customer;
