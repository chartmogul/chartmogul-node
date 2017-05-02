'use strict';

const Resource = require('./resource.js');

class Invoice extends Resource {

  static get path () {
    return '/v1/import/customers/{customerUuid}/invoices{/invoiceUuid}';
  }
}

// @Override
Invoice.all_customer = Invoice.all;
Invoice.all_any = Resource._method('GET', '/v1/invoices');

Invoice.all = function (config, params, cb) {
  if (typeof params === 'string') {
    return Invoice.all_customer(config, params, cb);
  } else {
    return Invoice.all_any(config, params, cb);
  }
};

module.exports = Invoice;
