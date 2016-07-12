'use strict';

const VERSION = require('../../package.json').version;
const API_BASE = 'https://api.chartmogul.com';

class Config {
  constructor (accountToken, secretKey) {
    this.accountToken = accountToken;
    this.secretKey = secretKey;
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
    return API_BASE;
  }

}

module.exports = Config;
