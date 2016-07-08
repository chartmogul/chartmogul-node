'use strict';

const errors = require('./chartmogul/errors');
const Import = require('./chartmogul/import');
const Enrichment = require('./chartmogul/enrichment');
const Config = require('./chartmogul/config');

const ChartMogul = {
  Config,
  Import,
  Enrichment
};
Object.assign(ChartMogul, errors);

module.exports = ChartMogul;
