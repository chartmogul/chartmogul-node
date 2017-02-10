'use strict';

const errors = require('./chartmogul/errors');
const Import = require('./chartmogul/import');
const Enrichment = require('./chartmogul/enrichment');
const Metrics = require('./chartmogul/metrics');

const Customer = require('./chartmogul/customer');
const DataSource = require('./chartmogul/data-source');
const Plan = require('./chartmogul/plan');
const Ping = require('./chartmogul/ping');

const Config = require('./chartmogul/config');

const ChartMogul = {
  Config,
  Import,
  Enrichment,
  Metrics,
  // New API
  Customer,
  DataSource,
  Plan,
  Ping
};
Object.assign(ChartMogul, errors);

module.exports = ChartMogul;
