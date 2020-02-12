'use strict';

const Resource = require('./resource.js');

class PlanGroupPlans extends Resource {
  static get path () {
    return '/v1/plan_groups/{planGroupUuid}/plans';
  }
}

PlanGroupPlans.all = Resource._method('GET', '/v1/plan_groups/{planGroupUuid}/plans');

module.exports = PlanGroupPlans;
