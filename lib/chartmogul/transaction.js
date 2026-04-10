'use strict';

const Resource = require('./resource.js');

class Transaction extends Resource {
  static get path () {
    return '/v1/import/invoices/{invoiceUuid}/transactions';
  }
}

// Create: POST /v1/import/invoices/:invoiceUuid/transactions
// (inherited from Resource via path template)

// Retrieve by UUID: GET /v1/transactions/:transactionUuid
Transaction.retrieve = Resource._method('GET', '/v1/transactions{/transactionUuid}');

// List/get by query params: GET /v1/transactions?data_source_uuid=X&external_id=Y
Transaction.all = Resource._method('GET', '/v1/transactions');

// Update by UUID: PATCH /v1/transactions/:transactionUuid
Transaction.modify = Resource._method('PATCH', '/v1/transactions{/transactionUuid}');

// Update by query params: PATCH /v1/transactions?data_source_uuid=X&external_id=Y  { body }
Transaction.update = Resource._method('PATCH', '/v1/transactions');

// Delete by UUID: DELETE /v1/transactions/:transactionUuid
Transaction.destroy = Resource._method('DELETE', '/v1/transactions{/transactionUuid}');

// Delete by query params: DELETE /v1/transactions?data_source_uuid=X&external_id=Y
Transaction.destroyByExternalId = Resource._method('DELETE', '/v1/transactions');

// Disable/enable by UUID: PATCH /v1/transactions/:transactionUuid/disabled_state
Transaction._setDisabledState = Resource._method('PATCH', '/v1/transactions{/transactionUuid}/disabled_state');
Transaction.disable = function (config, uuidOrParams, callback) {
  if (typeof uuidOrParams === 'string') {
    const args = [config, uuidOrParams, { disabled: true }];
    if (typeof callback === 'function') args.push(callback);
    return Transaction._setDisabledState.apply(this, args);
  }
  // query-param variant
  const data = { qs: uuidOrParams, disabled: true };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return Transaction._setDisabledStateByExternalId.apply(this, args);
};
Transaction.enable = function (config, uuidOrParams, callback) {
  if (typeof uuidOrParams === 'string') {
    const args = [config, uuidOrParams, { disabled: false }];
    if (typeof callback === 'function') args.push(callback);
    return Transaction._setDisabledState.apply(this, args);
  }
  // query-param variant
  const data = { qs: uuidOrParams, disabled: false };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return Transaction._setDisabledStateByExternalId.apply(this, args);
};

// Disable/enable by query params: PATCH /v1/transactions/disabled_state?data_source_uuid=X&external_id=Y
Transaction._setDisabledStateByExternalId = Resource._method('PATCH', '/v1/transactions/disabled_state');
Transaction.disableByExternalId = function (config, params, callback) {
  const data = { qs: params, disabled: true };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return Transaction._setDisabledStateByExternalId.apply(this, args);
};
Transaction.enableByExternalId = function (config, params, callback) {
  const data = { qs: params, disabled: false };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return Transaction._setDisabledStateByExternalId.apply(this, args);
};

module.exports = Transaction;
