'use strict';

const Resource = require('./resource.js');

class Invoice extends Resource {
  static get path () {
    return '/v1/import/customers/{customerUuid}/invoices';
  }
}

// @Override
Invoice.allCustomer = Invoice.all;

Invoice.allAny = Resource._method('GET', '/v1/invoices');

Invoice.all = function (config, params) {
  if (typeof params === 'string') {
    return Invoice.allCustomer.apply(this, arguments);
  } else {
    return Invoice.allAny.apply(this, arguments);
  }
};

Invoice.destroy = Resource._method('DELETE', '/v1/invoices{/uuid}');

Invoice.destroyAll = Resource._method('DELETE', 'v1/data_sources{/data_source_uuid}/customers{/customer_uuid}/invoices');

// Deprecated snake_case aliases
Invoice.all_customer = function (...args) {
  console.warn('[DEPRECATED] Invoice.all_customer is deprecated. Use Invoice.allCustomer instead.');
  return Invoice.allCustomer.apply(this, args);
};
Invoice.all_any = function (...args) {
  console.warn('[DEPRECATED] Invoice.all_any is deprecated. Use Invoice.allAny instead.');
  return Invoice.allAny.apply(this, args);
};
Invoice.destroy_all = function (...args) {
  console.warn('[DEPRECATED] Invoice.destroy_all is deprecated. Use Invoice.destroyAll instead.');
  return Invoice.destroyAll.apply(this, args);
};

Invoice.retrieve = Resource._method('GET', '/v1/invoices{/uuid}');

// PUT /v1/data_sources/:ds_uuid/invoices/:invoice_external_id/status
// Body: { status: 'voided' | 'written_off' }
Invoice.updateStatus = Resource._method('PUT', '/v1/data_sources{/data_source_uuid}/invoices{/invoice_external_id}/status');

// Disable/enable via PATCH /v1/invoices/:uuid/disabled_state
// Convenience wrapper: automatically sends { disabled: true }.
Invoice._setDisabledState = Resource._method('PATCH', '/v1/invoices{/uuid}/disabled_state');
Invoice.disable = function (config, uuid, dataOrCb, callback) {
  // Support: disable(config, uuid), disable(config, uuid, cb), disable(config, uuid, body, cb)
  let body = { disabled: true };
  let cb;
  if (typeof dataOrCb === 'function') {
    cb = dataOrCb;
  } else if (dataOrCb && typeof dataOrCb === 'object') {
    body = { ...dataOrCb, disabled: true };
    cb = callback;
  }
  const args = [config, uuid, body];
  if (typeof cb === 'function') args.push(cb);
  return Invoice._setDisabledState.apply(this, args);
};

Invoice.enable = function (config, uuid, callback) {
  const args = [config, uuid, { disabled: false }];
  if (typeof callback === 'function') args.push(callback);
  return Invoice._setDisabledState.apply(this, args);
};

// Update by UUID: PATCH /v1/invoices/:uuid
Invoice.modify = Resource._method('PATCH', '/v1/invoices{/uuid}');

// Update by query params: PATCH /v1/invoices?data_source_uuid=X&external_id=Y  { body }
Invoice.update = Resource._method('PATCH', '/v1/invoices');

// DELETE /v1/invoices?data_source_uuid=X&external_id=Y
Invoice.destroyByExternalId = Resource._method('DELETE', '/v1/invoices');

// PATCH /v1/invoices/disabled_state?data_source_uuid=X&external_id=Y  { disabled: bool }
Invoice._setDisabledStateByExternalId = Resource._method('PATCH', '/v1/invoices/disabled_state');
Invoice.disableByExternalId = function (config, params, callback) {
  const data = { qs: params, disabled: true };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return Invoice._setDisabledStateByExternalId.apply(this, args);
};
Invoice.enableByExternalId = function (config, params, callback) {
  const data = { qs: params, disabled: false };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return Invoice._setDisabledStateByExternalId.apply(this, args);
};

module.exports = Invoice;
