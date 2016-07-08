'use strict';

const Resource = require('../resource.js');

class Customer extends Resource {

  static get path () {
    return '/v1/customers{/customerUuid}{/attributes}';
  }

  static search(config, query){
    return this.retrieve(config, 'search', query);
  }

  static attributes(config, customerId){
    return this.retrieve(config, customerId, 'attributes');
  }



}

module.exports = Customer;
