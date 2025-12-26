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

  static connectSubscriptions (config, dataSourceUuid, customerUuid, data, cb) {
    const path = `/v1/data_sources/${dataSourceUuid}/customers/${customerUuid}/connect_subscriptions`;
    return Resource.request(config, 'POST', path, data, cb);
  }

  static disconnectSubscriptions (config, dataSourceUuid, customerUuid, data, cb) {
    const path = `/v1/data_sources/${dataSourceUuid}/customers/${customerUuid}/disconnect_subscriptions`;
    return Resource.request(config, 'POST', path, data, cb);
  }
}
module.exports = Customer;
