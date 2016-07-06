"use strict";

class Config {
  constructor(accountToken, secretKey) {
    this.accountToken = accountToken;
    this.secretKey = secretKey;
  }
  getAccountToken() {
    return this.accountToken;
  }
  getSecretKey() {
    return this.secretKey;
  }
}

module.exports = Config;
