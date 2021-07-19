'use strict';

const Resource = require('../resource.js');

class ActivitiesExport extends Resource {
  static get path () {
    return '/v1/activities_export/{activitiesExportUuid}';
  }
}

ActivitiesExport.create = Resource._method('POST', '/v1/activities_export');

module.exports = ActivitiesExport;
