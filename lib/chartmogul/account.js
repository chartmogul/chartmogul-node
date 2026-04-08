'use strict';

const Resource = require('./resource.js');

const VALID_INCLUDE_FIELDS = [
  'churn_recognition',
  'churn_when_zero_mrr',
  'auto_churn_subscription',
  'refund_handling',
  'proximate_movement_reclassification'
];

class Account extends Resource {
  static get path () {
    return '/v1/account';
  }
}

// @Override retrieve to validate include param
Account._retrieve = Resource._method('GET');
Account.retrieve = function (config, params, callback) {
  if (params && params.include) {
    const fields = params.include.split(',').map(function (f) { return f.trim(); });
    const invalid = fields.filter(function (f) { return VALID_INCLUDE_FIELDS.indexOf(f) === -1; });
    if (invalid.length > 0) {
      console.warn(
        '[chartmogul] Account.retrieve: unknown include field(s): ' +
        invalid.join(', ') +
        '. Allowed: ' + VALID_INCLUDE_FIELDS.join(', ')
      );
    }
  }
  const args = [config];
  if (params) args.push(params);
  if (typeof callback === 'function') args.push(callback);
  return Account._retrieve.apply(this, args);
};

module.exports = Account;
