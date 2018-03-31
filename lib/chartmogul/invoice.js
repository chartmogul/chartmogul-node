'use strict';

const Resource = require('./resource.js');

class Invoice extends Resource {

  static get path () {
    return '/v1/import/customers/{customerUuid}/invoices';
  }
}

// @Override
Invoice.all_customer = Invoice.all;

Invoice.all_any = Resource._method('GET', '/v1/invoices');

Invoice.all = function (config, params, cb) {
  if (typeof params === 'string') {
    return Invoice.all_customer.apply(Invoice, arguments);
  } else {
    return Invoice.all_any.apply(Invoice, arguments);
  }
};

Invoice.destroy = Resource._method('DELETE', '/v1/invoices{/uuid}');

Invoice.retrieve = Resource._method('GET', '/v1/invoices{/uuid}');

module.exports = Invoice;
