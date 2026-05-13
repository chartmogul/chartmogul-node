'use strict';

const Resource = require('./resource.js');

class Subscription extends Resource {
  static get path () {
    return '/v1/import/subscriptions{/subscriptionUuid}';
  }
}

// DEPRECATED: Use ChartMogul.Metrics.Customer.subscriptions instead
const _originalAll = Resource._method('GET', '/v1/import/customers/{customerUuid}/subscriptions');
Subscription.all = function deprecatedAll (config, customerUuid, data, callback) {
  console.warn('[DEPRECATED] Subscription.all is deprecated. Use ChartMogul.Metrics.Customer.subscriptions instead.');
  return _originalAll.call(this, config, customerUuid, data, callback);
};

module.exports = Subscription;
