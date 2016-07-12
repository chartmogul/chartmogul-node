'use strict';

const ChartMogulError = require('./chartmogul-error');
const ConfigurationError = require('./configuration-error');
const ForbiddenError = require('./forbidden-error');
const NotFoundError = require('./not-found-error');
const ResourceInvalidError = require('./resource-invalid-error');
const SchemaInvalidError = require('./schema-invalid-error');

module.exports = {
  ChartMogulError,
  ConfigurationError,
  ForbiddenError,
  NotFoundError,
  ResourceInvalidError,
  SchemaInvalidError
};
