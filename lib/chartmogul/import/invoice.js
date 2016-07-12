'use strict';

const Resource = require('../resource.js');

class Invoice extends Resource {

  static get path () {
    return '/v1/import/customers/{customerUuid}/invoices{/invoiceUuid}';
  }
}

module.exports = Invoice;
