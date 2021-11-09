'use strict';

const VERSION = require('../../package.json').version;
const API_BASE = 'https://api.chartmogul.com';

class Config {
  constructor (apiKey, apiBase) {
    this.apiKey = apiKey;
    this.apiBase = apiBase || API_BASE;
  }

  getApiKey () {
    return this.apiKey;
  }

  get VERSION () {
    return VERSION;
  }

  get API_BASE () {
    return this.apiBase;
  }
}

module.exports = Config;
