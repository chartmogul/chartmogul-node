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

// Disable/enable state toggling via PATCH /v1/subscription_events/:id/disabled_state
// These convenience wrappers automatically set { disabled: true/false }.
SubscriptionEvent._setDisabledState = Resource._method('PATCH', '/v1/subscription_events{/id}/disabled_state');
SubscriptionEvent.disable = function (config, id, callback) {
  const args = [config, id, { disabled: true }];
  if (typeof callback === 'function') args.push(callback);
  return SubscriptionEvent._setDisabledState.apply(this, args);
};
SubscriptionEvent.enable = function (config, id, callback) {
  const args = [config, id, { disabled: false }];
  if (typeof callback === 'function') args.push(callback);
  return SubscriptionEvent._setDisabledState.apply(this, args);
};

module.exports = SubscriptionEvent;
