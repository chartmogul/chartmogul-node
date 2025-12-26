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
    const payload = this._prepareSubscriptionsData(dataSourceUuid, data);
    const path = `/v1/customers/${customerUuid}/connect_subscriptions`;
    return Resource.request(config, 'POST', path, payload, cb);
  }

  static disconnectSubscriptions (config, dataSourceUuid, customerUuid, data, cb) {
    const payload = this._prepareSubscriptionsData(dataSourceUuid, data);
    const path = `/v1/customers/${customerUuid}/disconnect_subscriptions`;
    return Resource.request(config, 'POST', path, payload, cb);
  }

  static _prepareSubscriptionsData (dataSourceUuid, data) {
    return {
      subscriptions: data.map(subscription => ({
        data_source_uuid: dataSourceUuid,
        uuid: subscription.uuid
      }))
    };
  }
}
module.exports = Customer;
