'use strict';

const Resource = require('../resource.js');

class Tag extends Resource {

  static get path () {
    return '/v1/customers{/customerUuid}/attributes/tags';
  }

}

module.exports = Tag;
