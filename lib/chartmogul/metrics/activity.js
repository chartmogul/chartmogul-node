'use strict';

const Resource = require('../resource.js');

class Activity extends Resource {
  static get path () {
    return '/v1/activities';
  }
}

Activity.all = Resource._method('GET', '/v1/activities');

module.exports = Activity;
