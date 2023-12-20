'use strict';

const Resource = require('./resource');
const util = require('./util');
const CustomerNote = require('./customer-note');

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

  static contacts (config, customerId, params, callback) {
    const path = util.expandPath(this.path, [customerId, 'contacts']);
    return Resource.request(config, 'GET', path, params, callback);
  }

  static createContact (config, customerId, params, callback) {
    const path = util.expandPath(this.path, [customerId, 'contacts']);
    return Resource.request(config, 'POST', path, params, callback);
  }

  static notes (config, customerId, params, callback) {
    const path = util.expandPath(CustomerNote.path, []);
    return Resource.request(config, 'GET', path, { ...params, customer_uuid: customerId }, callback);
  }

  static createNote (config, customerId, params, callback) {
    const path = util.expandPath(CustomerNote.path, []);
    return Resource.request(config, 'POST', path, { ...params, customer_uuid: customerId }, callback);
  }
}

// @Override
Customer.modify = Resource._method('PATCH', '/v1/customers/{customerUuid}');

Customer.merge = Resource._method('POST', '/v1/customers/merges');

Customer.connectSubscriptions = Resource._method('POST', '/v1/customers/{customerUuid}/connect_subscriptions');

module.exports = Customer;
