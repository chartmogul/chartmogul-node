'use strict';

const Resource = require('./resource');

class Task extends Resource {
  static get path () {
    return '/v1/tasks{/taskUuid}';
  }
}

module.exports = Task;
