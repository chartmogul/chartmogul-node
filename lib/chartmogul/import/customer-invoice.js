'use strict';

const Resource = require('../resource.js');

class CustomerInvoice extends Resource {

  static get path () {
    return '/v1/import/customers/{customerUuid}/invoices{/invoiceUuid}';
  }
}

module.exports = CustomerInvoice;
