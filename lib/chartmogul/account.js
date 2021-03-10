'use strict';

const Resource = require('./resource.js');

class Account extends Resource {
  static get path () {
    return '/v1/account';
  }
}

module.exports = Account;
