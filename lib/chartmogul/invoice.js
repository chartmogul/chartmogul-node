'use strict';

const Resource = require('./resource.js');

class Invoice extends Resource {
  static get path () {
    return '/v1/import/customers/{customerUuid}/invoices';
  }
}

// @Override
Invoice.all_customer = Invoice.all;

Invoice.all_any = Resource._method('GET', '/v1/invoices');

Invoice.all = function (config, params) {
  if (typeof params === 'string') {
    return Invoice.all_customer.apply(this, arguments);
  } else {
    return Invoice.all_any.apply(this, arguments);
  }
};

Invoice.destroy = Resource._method('DELETE', '/v1/invoices{/uuid}');

Invoice.destroy_all = Resource._method('DELETE', 'v1/data_sources{/data_source_uuid}/customers{/customer_uuid}/invoices');

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

module.exports = Invoice;
