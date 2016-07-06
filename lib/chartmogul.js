"use strict";

const VERSION = require('../package.json').version;
const API_BASE = 'https://api.chartmogul.com';

class ChartMogul {
  // constructor(accountToken, secretKey){
  //   this.accountToken = accountToken;
  //   this.secretKey = secretKey;
  // }

  static get VERSION() {
    return VERSION;
  }

  static get API_BASE() {
    return API_BASE;
  }
}

module.exports = ChartMogul;

const errors = require('./chartmogul/errors');
const Import = require('./chartmogul/import');
const Config = require('./chartmogul/config');

Object.assign(ChartMogul, {
  Config,
  Import
});
Object.assign(ChartMogul, errors);
