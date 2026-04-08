'use strict';

const Resource = require('./resource.js');

class LineItem extends Resource {
  static get path () {
    return '/v1/line_items{/lineItemUuid}';
  }
}

// Create: POST /v1/import/invoices/:invoiceUuid/line_items
LineItem.create = Resource._method('POST', '/v1/import/invoices{/invoiceUuid}/line_items');

// Retrieve by UUID: GET /v1/line_items/:lineItemUuid
// (inherited from Resource via path template)

// List/get by query params: GET /v1/line_items?data_source_uuid=X&external_id=Y
LineItem.all = Resource._method('GET', '/v1/line_items');

// Update by UUID: PATCH /v1/line_items/:lineItemUuid
// (inherited `modify` from Resource via path template)

// Update by query params: PATCH /v1/line_items?data_source_uuid=X&external_id=Y  { body }
LineItem.update = Resource._method('PATCH', '/v1/line_items');

// Delete by UUID: DELETE /v1/line_items/:lineItemUuid
LineItem.destroy = Resource._method('DELETE', '/v1/line_items{/lineItemUuid}');

// Delete by query params: DELETE /v1/line_items?data_source_uuid=X&external_id=Y
LineItem.destroyByExternalId = Resource._method('DELETE', '/v1/line_items');

// Disable/enable by UUID: PATCH /v1/line_items/:lineItemUuid/disabled_state
LineItem._setDisabledState = Resource._method('PATCH', '/v1/line_items{/lineItemUuid}/disabled_state');
LineItem.disable = function (config, uuidOrParams, callback) {
  if (typeof uuidOrParams === 'string') {
    const args = [config, uuidOrParams, { disabled: true }];
    if (typeof callback === 'function') args.push(callback);
    return LineItem._setDisabledState.apply(this, args);
  }
  // query-param variant
  const data = { qs: uuidOrParams, disabled: true };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return LineItem._setDisabledStateByExternalId.apply(this, args);
};
LineItem.enable = function (config, uuidOrParams, callback) {
  if (typeof uuidOrParams === 'string') {
    const args = [config, uuidOrParams, { disabled: false }];
    if (typeof callback === 'function') args.push(callback);
    return LineItem._setDisabledState.apply(this, args);
  }
  // query-param variant
  const data = { qs: uuidOrParams, disabled: false };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return LineItem._setDisabledStateByExternalId.apply(this, args);
};

// Disable/enable by query params: PATCH /v1/line_items/disabled_state?data_source_uuid=X&external_id=Y
LineItem._setDisabledStateByExternalId = Resource._method('PATCH', '/v1/line_items/disabled_state');
LineItem.disableByExternalId = function (config, params, callback) {
  const data = { qs: params, disabled: true };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return LineItem._setDisabledStateByExternalId.apply(this, args);
};
LineItem.enableByExternalId = function (config, params, callback) {
  const data = { qs: params, disabled: false };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return LineItem._setDisabledStateByExternalId.apply(this, args);
};

module.exports = LineItem;
