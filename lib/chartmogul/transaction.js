'use strict';

const Resource = require('./resource.js');

class Transaction extends Resource {
  static get path () {
    return '/v1/import/invoices/{invoiceUuid}/transactions';
  }
}

// GET /v1/transactions?data_source_uuid=X&external_id=Y
Transaction.all = Resource._method('GET', '/v1/transactions');

// PATCH /v1/transactions?data_source_uuid=X&external_id=Y  { body }
Transaction.update = Resource._method('PATCH', '/v1/transactions');

// DELETE /v1/transactions?data_source_uuid=X&external_id=Y
Transaction.destroy = Resource._method('DELETE', '/v1/transactions');

// PATCH /v1/transactions/disabled_state?data_source_uuid=X&external_id=Y  { disabled: bool }
Transaction._setDisabledState = Resource._method('PATCH', '/v1/transactions/disabled_state');
Transaction.disable = function (config, params, callback) {
  const data = { qs: params, disabled: true };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return Transaction._setDisabledState.apply(this, args);
};
Transaction.enable = function (config, params, callback) {
  const data = { qs: params, disabled: false };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return Transaction._setDisabledState.apply(this, args);
};

module.exports = Transaction;
