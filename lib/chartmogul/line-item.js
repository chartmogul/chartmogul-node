'use strict';

const Resource = require('./resource.js');

class LineItem extends Resource {
  static get path () {
    return '/v1/line_items';
  }
}

// GET /v1/line_items?data_source_uuid=X&external_id=Y
LineItem.all = Resource._method('GET', '/v1/line_items');

// PATCH /v1/line_items?data_source_uuid=X&external_id=Y  { body }
LineItem.update = Resource._method('PATCH', '/v1/line_items');

// DELETE /v1/line_items?data_source_uuid=X&external_id=Y
LineItem.destroy = Resource._method('DELETE', '/v1/line_items');

// PATCH /v1/line_items/disabled_state?data_source_uuid=X&external_id=Y  { disabled: bool }
LineItem._setDisabledState = Resource._method('PATCH', '/v1/line_items/disabled_state');
LineItem.disable = function (config, params, callback) {
  const data = { qs: params, disabled: true };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return LineItem._setDisabledState.apply(this, args);
};
LineItem.enable = function (config, params, callback) {
  const data = { qs: params, disabled: false };
  const args = [config, data];
  if (typeof callback === 'function') args.push(callback);
  return LineItem._setDisabledState.apply(this, args);
};

module.exports = LineItem;
