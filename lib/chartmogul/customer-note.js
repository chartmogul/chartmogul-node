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

// DEPRECATED: Use ChartMogul.EntityNote instead
['all', 'create', 'retrieve', 'patch', 'destroy'].forEach(methodName => {
  const original = Resource[methodName];
  CustomerNote[methodName] = function (...args) {
    console.warn(`[DEPRECATED] CustomerNote.${methodName} is deprecated. Use ChartMogul.EntityNote.${methodName} instead.`);
    return original.apply(this, args);
  };
});

module.exports = CustomerNote;
