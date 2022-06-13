'use strict';

const Resource = require('./resource.js');

class SubscriptionEvent extends Resource {
  static get path () {
    return '/v1/subscription_events';
  }
}

SubscriptionEvent.updateWithParams = Resource._method('PATCH', this.path);
SubscriptionEvent.deleteWithParams = Resource._method('DELETE', this.path);

module.exports = SubscriptionEvent;
