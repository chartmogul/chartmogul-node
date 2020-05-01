'use strict';

const Resource = require('./resource.js');

class Ping extends Resource {
  static get path () {
    return '/v1/ping';
  }
}

Ping.ping = Resource._method('GET');

module.exports = Ping;
