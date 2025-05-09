'use strict';

const errors = require('./chartmogul/errors');
const Metrics = require('./chartmogul/metrics');

const Customer = require('./chartmogul/customer');
const CustomerNote = require('./chartmogul/customer-note');
const Contact = require('./chartmogul/contact');
const DataSource = require('./chartmogul/data-source');
const Opportunity = require('./chartmogul/opportunity');
const Plan = require('./chartmogul/plan');
const PlanGroup = require('./chartmogul/plan-group');
const Ping = require('./chartmogul/ping');
const Task = require('./chartmogul/task');

const Invoice = require('./chartmogul/invoice');
const Subscription = require('./chartmogul/subscription');
const Transaction = require('./chartmogul/transaction');
const SubscriptionEvent = require('./chartmogul/subscription_event');

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
  CustomerNote,
  Contact,
  DataSource,
  Enrichment,
  Import,
  Invoice,
  Metrics,
  Opportunity,
  Ping,
  Plan,
  PlanGroup,
  Subscription,
  SubscriptionEvent,
  Tag,
  Task,
  Transaction,
  Account
};

Object.assign(ChartMogul, errors);

module.exports = ChartMogul;
