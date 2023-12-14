'use strict';

const Resource = require('./resource');

class CustomerNote extends Resource {
  static get path () {
    return '/v1/customer_notes{/noteUuid}';
  }
}

module.exports = CustomerNote;
