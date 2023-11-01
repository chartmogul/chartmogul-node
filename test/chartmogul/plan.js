'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const Plan = ChartMogul.Plan;

describe('Plan', () => {
  it('should create a new plan', () => {
    /* eslint-disable camelcase */
    const postBody = {
      data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
      name: 'Bronze Plan',
      interval_count: 1,
      interval_unit: 'month',
      external_id: 'plan_0001'
    };
    /* eslint-enable camelcase */

    nock(config.API_BASE)
      .post('/v1/plans', postBody)
      .reply(200, {
        /* eslint-disable camelcase */
        uuid: 'pl_cff3a63c-3915-435e-a675-85a8a8ef4454',
        external_id: 'plan_0001',
        name: 'Bronze Plan',
        interval_count: 1,
        interval_unit: 'month',
        data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1'
        /* eslint-enable camelcase */
      });

    return Plan.create(config, postBody)
      .then(res => {
        expect(res).to.have.property('uuid');
      });
  });

  it('throws DeprecatedParamError if using old pagination parameter', done => {
    const query = {
      page: 1
    };

    nock(config.API_BASE)
      .get('/v1/plans')
      .query(query)
      .reply(200, {});
    Plan.all(config, query)
      .then(res => done(new Error('Should throw error')))
      .catch(e => {
        expect(e).to.be.instanceOf(ChartMogul.DeprecatedParamError);
        expect(e.httpStatus).to.equal(422);
        expect(e.message).to.equal('"page" param is deprecated {}');
        done();
      });
  });

  it('should get all plans with pagination', () => {
    nock(config.API_BASE)
      .get('/v1/plans')
      .reply(200, {
      /* eslint-disable camelcase */
        plans: [],
        cursor: 'cursor==',
        has_more: false
      /* eslint-enable camelcase */
      });

    return Plan.all(config)
      .then(res => {
        expect(res).to.have.property('plans');
        expect(res.plans).to.be.instanceof(Array);
        expect(res.cursor).to.eql('cursor==');
        expect(res.has_more).to.eql(false);
      });
  });

  it('should modify a plan', () => {
    /* eslint-disable camelcase */
    const postBody = {
      name: 'new_name'
    };
    /* eslint-enable camelcase */
    nock(config.API_BASE)
      .patch('/v1/plans/pl_cff3a63c-3915-435e-a675-85a8a8ef4454')
      .reply(200, {
      /* eslint-disable camelcase */
        uuid: 'pl_cff3a63c-3915-435e-a675-85a8a8ef4454',
        data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
        name: 'new_name',
        interval_count: 1,
        interval_unit: 'month',
        external_id: 'plan_0001'
      /* eslint-enable camelcase */
      });

    return Plan.modify(config, 'pl_cff3a63c-3915-435e-a675-85a8a8ef4454', postBody)
      .then(res => {
        expect(res).to.have.property('uuid');
        expect(res).to.have.property('name');
        expect(res.name).to.be.equal('new_name');
      });
  });

  it('should delete a plan', () => {
    nock(config.API_BASE)
      .delete('/v1/plans/pl_cff3a63c-3915-435e-a675-85a8a8ef4454')
      .reply(200, {});

    return Plan.destroy(config, 'pl_cff3a63c-3915-435e-a675-85a8a8ef4454')
      .then(res => {
        expect(res).to.be.deep.equal({});
      });
  });
});
