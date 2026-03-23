'use strict';

const Resource = require('./resource.js');

function wrapParams (data) {
  if (data && typeof data === 'object' && !data.subscription_event) {
    return { subscription_event: data };
  }
  return data;
}

function wrapMethod (name, verb, path) {
  const inner = Resource._method(verb, path);
  SubscriptionEvent[name] = function (config, data, callback) {
    const args = [config, wrapParams(data)];
    if (typeof callback === 'function') args.push(callback);
    return inner.apply(this, args);
  };
}

class SubscriptionEvent extends Resource {
  static get path () {
    return '/v1/subscription_events';
  }
}

wrapMethod('create', 'POST');
wrapMethod('updateWithParams', 'PATCH', '/v1/subscription_events');
wrapMethod('deleteWithParams', 'DELETE', '/v1/subscription_events');

// Disable/enable state toggling
SubscriptionEvent.disable = Resource._method('PATCH', '/v1/subscription_events{/id}/disable');
SubscriptionEvent.enable = Resource._method('PATCH', '/v1/subscription_events{/id}/enable');

module.exports = SubscriptionEvent;
