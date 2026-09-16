'use strict';

const Resource = require('./resource');

/**
 * @deprecated /v1/customer_notes is superseded by /v1/notes. Use ChartMogul.EntityNote instead.
 */
class CustomerNote extends Resource {
  static get path () {
    return '/v1/customer_notes{/noteUuid}';
  }
}

// DEPRECATED: Use ChartMogul.EntityNote.all instead
CustomerNote.all = function (...args) {
  console.warn('[DEPRECATED] CustomerNote.all is deprecated. Use ChartMogul.EntityNote.all instead.');
  return Resource.all.apply(this, args);
};

// DEPRECATED: Use ChartMogul.EntityNote.create instead
CustomerNote.create = function (...args) {
  console.warn('[DEPRECATED] CustomerNote.create is deprecated. Use ChartMogul.EntityNote.create instead.');
  return Resource.create.apply(this, args);
};

// DEPRECATED: Use ChartMogul.EntityNote.retrieve instead
CustomerNote.retrieve = function (...args) {
  console.warn('[DEPRECATED] CustomerNote.retrieve is deprecated. Use ChartMogul.EntityNote.retrieve instead.');
  return Resource.retrieve.apply(this, args);
};

// DEPRECATED: Use ChartMogul.EntityNote.patch instead
CustomerNote.patch = function (...args) {
  console.warn('[DEPRECATED] CustomerNote.patch is deprecated. Use ChartMogul.EntityNote.patch instead.');
  return Resource.patch.apply(this, args);
};

// DEPRECATED: Use ChartMogul.EntityNote.destroy instead
CustomerNote.destroy = function (...args) {
  console.warn('[DEPRECATED] CustomerNote.destroy is deprecated. Use ChartMogul.EntityNote.destroy instead.');
  return Resource.destroy.apply(this, args);
};

module.exports = CustomerNote;
