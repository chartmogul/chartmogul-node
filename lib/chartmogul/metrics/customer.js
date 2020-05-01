'use strict';

const Resource = require('../resource.js');
const util = require('../util');

class Customer {
  static get path () {
    return '/v1/customers/{customerUuid}/{action}';
  }

  static activities (config, customerUuid, query, cb) {
    const action = 'activities';
    const path = util.expandPath(this.path, {
      customerUuid,
      action
    });
    return Resource.request(config, 'GET', path, query, cb);
  }

  static subscriptions (config, customerUuid, query, cb) {
    const action = 'subscriptions';
    const path = util.expandPath(this.path, {
      customerUuid,
      action
    });
    return Resource.request(config, 'GET', path, query, cb);
  }
}
module.exports = Customer;
