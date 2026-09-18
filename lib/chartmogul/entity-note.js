'use strict';

const Resource = require('./resource');

class EntityNote extends Resource {
  static get path () {
    return '/v1/notes{/noteUuid}';
  }
}

module.exports = EntityNote;
