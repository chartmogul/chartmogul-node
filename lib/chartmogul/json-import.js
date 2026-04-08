'use strict';

const Resource = require('./resource.js');

class JsonImport extends Resource {
  static get path () {
    return '/v1/data_sources{/dataSourceUuid}/json_imports{/importId}';
  }
}

JsonImport.create = Resource._method('POST', '/v1/data_sources{/dataSourceUuid}/json_imports');
JsonImport.retrieve = Resource._method('GET', '/v1/data_sources{/dataSourceUuid}/json_imports{/importId}');

module.exports = JsonImport;
