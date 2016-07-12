'use strict';

const Resource = require('../resource.js');

class Transaction extends Resource {

  static get path () {
    return '/v1/import/invoices/{invoiceUuid}/transactions';
  }

}

module.exports = Transaction;
