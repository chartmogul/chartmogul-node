'use strict';

const VERSION = require('../../package.json').version;
const API_BASE = 'https://api.chartmogul.com';

class Config {
  constructor (accountToken, secretKey, apiBase) {
    this.accountToken = accountToken;
    this.secretKey = secretKey;
    this.apiBase = apiBase || API_BASE;
  }

  getAccountToken () {
    return this.accountToken;
  }

  getSecretKey () {
    return this.secretKey;
  }

  get VERSION () {
    return VERSION;
  }

  get API_BASE () {
    return this.apiBase;
  }
}

module.exports = Config;
