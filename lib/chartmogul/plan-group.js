'use strict';

const Resource = require('./resource.js');
const PlanGroupPlans = require('./plan-group-plans');

class PlanGroup extends Resource {
  static get path () {
    return '/v1/plan_groups{/plangroupUuid}';
  }
}

// @Override
PlanGroup.allAny = Resource._method('GET', '/v1/plan_groups');

PlanGroup.all = function (config, params) {
  if (typeof params === 'string') {
    return PlanGroupPlans.all.apply(this, arguments);
  } else {
    return PlanGroup.allAny.apply(this, arguments);
  }
};

// Deprecated snake_case alias
PlanGroup.all_any = PlanGroup.allAny;

module.exports = PlanGroup;
