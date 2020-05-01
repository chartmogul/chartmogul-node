'use strict';

const Resource = require('./resource.js');

class Plan extends Resource {
  static get path () {
    return '/v1/plans{/planUuid}';
  }
}

module.exports = Plan;
