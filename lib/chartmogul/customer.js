'use strict';

const Resource = require('./resource');
const util = require('./util');
const CustomerNote = require('./customer-note');
const Opportunity = require('./opportunity');
const Task = require('./task');

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

  static opportunities (config, customerId, params, callback) {
    const path = util.expandPath(Opportunity.path, []);
    return Resource.request(config, 'GET', path, { ...params, customer_uuid: customerId }, callback);
  }

  static createOpportunity (config, customerId, params, callback) {
    const path = util.expandPath(Opportunity.path, []);
    return Resource.request(config, 'POST', path, { ...params, customer_uuid: customerId }, callback);
  }

  static tasks (config, customerUuid, params, callback) {
    const path = util.expandPath(Task.path, []);
    return Resource.request(config, 'GET', path, { ...params, customer_uuid: customerUuid }, callback);
  }

  static createTask (config, customerUuid, params, callback) {
    const path = util.expandPath(Task.path, []);
    return Resource.request(config, 'POST', path, { ...params, customer_uuid: customerUuid }, callback);
  }
}

// @Override
Customer.modify = Resource._method('PATCH', '/v1/customers/{customerUuid}');

Customer.merge = Resource._method('POST', '/v1/customers/merges');

Customer.unmerge = Resource._method('POST', '/v1/customers/unmerges');

// DEPRECATED: Use ChartMogul.Metrics.Customer.connectSubscriptions instead
const _connectSubscriptions = Resource._method('POST', '/v1/customers/{customerUuid}/connect_subscriptions');
Customer.connectSubscriptions = function (...args) {
  console.warn('[DEPRECATED] Customer.connectSubscriptions is deprecated. Use ChartMogul.Metrics.Customer.connectSubscriptions instead.');
  return _connectSubscriptions.apply(this, args);
};

// DEPRECATED: Use ChartMogul.Metrics.Customer.disconnectSubscriptions instead
const _disconnectSubscriptions = Resource._method('POST', '/v1/customers/{customerUuid}/disconnect_subscriptions');
Customer.disconnectSubscriptions = function (...args) {
  console.warn('[DEPRECATED] Customer.disconnectSubscriptions is deprecated. Use ChartMogul.Metrics.Customer.disconnectSubscriptions instead.');
  return _disconnectSubscriptions.apply(this, args);
};

module.exports = Customer;
