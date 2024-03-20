'use strict';

const Resource = require('./resource');

class Opportunity extends Resource {
  static get path () {
    return '/v1/opportunities{/opportunityUuid}';
  }
}

module.exports = Opportunity;
