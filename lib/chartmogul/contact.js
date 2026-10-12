'use strict';

const Resource = require('./resource');
const util = require('./util');
const EntityNote = require('./entity-note');
const Task = require('./task');

// The API has no contact-nested routes; a contact association is expressed
// through associated_object_identifier unless the caller already chose one.
function withContactAssociation (contactUuid, params) {
  const body = { ...params };
  if (body.customer_uuid == null && body.associated_object_identifier == null) {
    body.associated_object_identifier = { associated_object: 'contact', method: 'uuid', value: contactUuid };
  }
  return body;
}

class Contact extends Resource {
  static get path () {
    return '/v1/contacts{/contactUuid}';
  }

  static merge (config, intoUuid, fromUuid, callback) {
    const path = util.expandPath(this.path, [intoUuid]);
    return Resource.request(config, 'POST', `${path}/merge/${fromUuid}`, {}, callback);
  }

  static tasks (config, contactUuid, params, callback) {
    const path = util.expandPath(Task.path, []);
    return Resource.request(config, 'GET', path, { ...params, contact_uuid: contactUuid }, callback);
  }

  static createTask (config, contactUuid, params, callback) {
    const path = util.expandPath(Task.path, []);
    return Resource.request(config, 'POST', path, withContactAssociation(contactUuid, params), callback);
  }

  static entityNotes (config, contactUuid, params, callback) {
    const path = util.expandPath(EntityNote.path, []);
    return Resource.request(config, 'GET', path, { ...params, contact_uuid: contactUuid }, callback);
  }

  static createEntityNote (config, contactUuid, params, callback) {
    const path = util.expandPath(EntityNote.path, []);
    return Resource.request(config, 'POST', path, withContactAssociation(contactUuid, params), callback);
  }
}

// @Override
Contact.modify = Resource._method('PATCH', '/v1/contacts/{contactUuid}');

module.exports = Contact;
