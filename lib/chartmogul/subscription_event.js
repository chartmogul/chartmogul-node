'use strict';

const Resource = require('./resource.js');

function wrapParams (data) {
  if (data && !data.subscription_event) {
    return { subscription_event: data };
  }
  return data;
}

class SubscriptionEvent extends Resource {
  static get path () {
    return '/v1/subscription_events';
  }
}

// @Override create to wrap flat params in envelope
SubscriptionEvent._create = Resource._method('POST');
SubscriptionEvent.create = function (config, data, callback) {
  const args = [config, wrapParams(data)];
  if (callback) args.push(callback);
  return SubscriptionEvent._create.apply(this, args);
};

// @Override update to wrap flat params in envelope
SubscriptionEvent._updateWithParams = Resource._method('PATCH', '/v1/subscription_events');
SubscriptionEvent.updateWithParams = function (config, data, callback) {
  const args = [config, wrapParams(data)];
  if (callback) args.push(callback);
  return SubscriptionEvent._updateWithParams.apply(this, args);
};

// @Override delete to wrap flat params in envelope
SubscriptionEvent._deleteWithParams = Resource._method('DELETE', '/v1/subscription_events');
SubscriptionEvent.deleteWithParams = function (config, data, callback) {
  const args = [config, wrapParams(data)];
  if (callback) args.push(callback);
  return SubscriptionEvent._deleteWithParams.apply(this, args);
};

// Disable/enable state toggling
SubscriptionEvent.disable = Resource._method('PATCH', '/v1/subscription_events{/id}/disable');
SubscriptionEvent.enable = Resource._method('PATCH', '/v1/subscription_events{/id}/enable');

module.exports = SubscriptionEvent;
