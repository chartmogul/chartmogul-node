'use strict';

const Resource = require('../resource.js');

class CustomAttribute extends Resource {

  static get path () {
    return '/v1/customers{/customerUuid}/attributes/custom';
  }

}

module.exports = CustomAttribute;
