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

Invoice.all = function (config, params) {
  if (typeof params === 'string') {
    return Invoice.all_customer.apply(this, arguments);
  } else {
    return Invoice.all_any.apply(this, arguments);
  }
};

Invoice.destroy = Resource._method('DELETE', '/v1/invoices{/uuid}');

Invoice.destroy_all = Resource._method('DELETE', 'v1/data_sources{/data_source_uuid}/customers{/customer_uuid}/invoices');

Invoice.retrieve = Resource._method('GET', '/v1/invoices{/uuid}');

module.exports = Invoice;
