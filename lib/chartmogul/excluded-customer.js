'use strict';

const Resource = require('./resource');

class ExcludedCustomer extends Resource {
  static get path () {
    return '/v1/excluded_customers{/customerUuid}';
  }
}

ExcludedCustomer.reinclude = Resource._method('DELETE');

module.exports = ExcludedCustomer;
