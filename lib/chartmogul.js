"use strict";

const errors = require('./chartmogul/errors');
const Import = require('./chartmogul/import');
const Config = require('./chartmogul/config');

const ChartMogul = {
  Config,
  Import
};
Object.assign(ChartMogul, errors);

module.exports = ChartMogul;
