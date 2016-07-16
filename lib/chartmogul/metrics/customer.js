'use strict';

const Resource = require('../resource.js');
const util = require('../util');

class Customer {

  static get path () {
    return '/v1/customers/{customerUuid}/{action}';
  }

  static activities (config, customerUuid, cb) {
    let action = 'activities';
    let path = util.expandPath(this.path, {
      customerUuid,
      action
    });
    return Resource.request(config, 'GET', path, {}, cb);
  }

  static subscriptions (config, customerUuid, cb) {
    let action = 'subscriptions';
    let path = util.expandPath(this.path, {
      customerUuid,
      action
    });
    return Resource.request(config, 'GET', path, {}, cb);
  }
}
module.exports = Customer;
