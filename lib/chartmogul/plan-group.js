'use strict';

const Resource = require('./resource.js');
const PlanGroupPlans = require('./plan-group-plans');

class PlanGroup extends Resource {
  static get path () {
    return '/v1/plan_groups{/plangroupUuid}';
  }
}

// @Override
PlanGroup.all_any = Resource._method('GET', '/v1/plan_groups');

PlanGroup.all = function (config, params) {
  if (typeof params === 'string') {
    return PlanGroupPlans.all.apply(this, arguments);
  } else {
    return PlanGroup.all_any.apply(this, arguments);
  }
};

module.exports = PlanGroup;
