'use strict';

const Resource = require('./resource');
const util = require('./util');

class Contact extends Resource {
  static get path () {
    return '/v1/contacts{/contactUuid}';
  }

  static modify = Resource._method('PATCH', '/v1/contacts/{contactUuid}');

  static merge (config, intoUuid, fromUuid, callback) {
    const path = util.expandPath(this.path, [intoUuid]);
    return Resource.request(config, 'POST', `${path}/merge/${fromUuid}`, {}, callback);
  }
}

module.exports = Contact;
