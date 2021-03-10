'use strict';

const errors = require('./chartmogul/errors');
const Metrics = require('./chartmogul/metrics');

const Customer = require('./chartmogul/customer');
const DataSource = require('./chartmogul/data-source');
const Plan = require('./chartmogul/plan');
const PlanGroup = require('./chartmogul/plan-group');
const Ping = require('./chartmogul/ping');

const Invoice = require('./chartmogul/invoice');
const Subscription = require('./chartmogul/subscription');
const Transaction = require('./chartmogul/transaction');

const CustomAttribute = require('./chartmogul/custom-attribute');
const Tag = require('./chartmogul/tag');

const Account = require('./chartmogul/account');

const Config = require('./chartmogul/config');

// Deprecated modules
const Import = require('./chartmogul/import');
const Enrichment = require('./chartmogul/enrichment');

const ChartMogul = {
  Config,
  CustomAttribute,
  Customer,
  DataSource,
  Enrichment,
  Import,
  Invoice,
  Metrics,
  Ping,
  Plan,
  PlanGroup,
  Subscription,
  Tag,
  Transaction,
  Account
};

Object.assign(ChartMogul, errors);

module.exports = ChartMogul;
