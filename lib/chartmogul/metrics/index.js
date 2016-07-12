'use strict';

const Resource = require('../resource.js');
const Customer = require('./customer');
const util = require('../util');

class Metrics {

  static get path () {
    return '/v1/metrics{/customerUuid}{/action}';
  }

}

const actions = {
  'all': 'all',
  'mrr': 'mrr',
  'arr': 'arr',
  'arpa': 'arpa',
  'asp': 'asp',
  'customerCount': 'customer-count',
  'customerChurnRate': 'customer-churn-rate',
  'mrrChurnRate': 'mrr-churn-rate',
  'ltv': 'ltv'
};

Object.keys(actions).forEach(method => {
  let action = actions[method];
  Metrics[method] = function (config, data, cb) {
    let path = util.expandPath(this.path, {
      action
    });
    return Resource.request(config, 'GET', path, data, cb);
  };
});

Metrics.Customer = Customer;
module.exports = Metrics;
