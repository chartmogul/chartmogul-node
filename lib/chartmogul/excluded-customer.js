'use strict';

const Resource = require('./resource');

class ExcludedCustomer extends Resource {
  static get path () {
    return '/v1/excluded_customers{/customerUuid}';
  }
}

module.exports = ExcludedCustomer;
