'use strict';

const ChartMogul = require('../../../lib/chartmogul');
const config = new ChartMogul.Config('token', 'secret');
const expect = require('chai').expect;
const nock = require('nock');
const Plan = ChartMogul.Import.Plan;

describe('Plan', () => {
  it('should create a new plan', () => {
    /* eslint-disable camelcase*/
    const postBody = {
      data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
      name: 'Bronze Plan',
      interval_count: 1,
      interval_unit: 'month',
      external_id: 'plan_0001'
    };
    /* eslint-enable camelcase*/

    nock(config.API_BASE)
      .post('/v1/import/plans', postBody)
      .reply(200, {
        /* eslint-disable camelcase*/
        uuid: 'pl_cff3a63c-3915-435e-a675-85a8a8ef4454',
        external_id: 'plan_0001',
        name: 'Bronze Plan',
        interval_count: 1,
        interval_unit: 'month',
        data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1'
        /* eslint-enable camelcase*/
      });

    return Plan.create(config, postBody)
    .then(res => {
      expect(res).to.have.property('uuid');
    });
  });

  it('should get all plans', () => {
    nock(config.API_BASE)
    .get('/v1/import/plans')
    .reply(200, {
      /* eslint-disable camelcase*/
      plans: [],
      current_page: 1,
      total_pages: 0
      /* eslint-enable camelcase*/
    });

    return Plan.all(config)
    .then(res => {
      expect(res).to.have.property('plans');
      expect(res.plans).to.be.instanceof(Array);
    });
  });
});
