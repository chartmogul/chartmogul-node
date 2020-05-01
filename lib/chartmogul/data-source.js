'use strict';

const Resource = require('./resource.js');

class DataSource extends Resource {
  static get path () {
    return '/v1/data_sources{/dataSourceUuid}';
  }
}

module.exports = DataSource;
