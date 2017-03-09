'use strict';

const Resource = require('./resource.js');

class Subscription extends Resource {

  static get path () {
    return '/v1/import/subscriptions{/subscriptionUuid}';
  }

}

// @Override
Subscription.all = Resource._method('GET', '/v1/import/customers/{customerUuid}/subscriptions');

module.exports = Subscription;
