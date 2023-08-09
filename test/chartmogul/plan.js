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

  it('should get all plans', () => {
    nock(config.API_BASE)
      .get('/v1/plans')
      .reply(200, {
      /* eslint-disable camelcase */
        plans: [
          {
            external_id: 'price_1NYSWgIFhx3XTAwSSnub7K43',
            name: 'Test Product',
            interval_count: 1,
            uuid: 'pl_93756449-aaea-4662-9e3a-004e52f14adc',
            interval_unit: 'month',
            data_source_uuid: 'ds_d02c7c42-2d1d-11ee-8e58-3fa5919351b4'
          }
        ],
        cursor: 'MjAyMy0wNy0yOFQwODowOT==',
        has_more: true
      /* eslint-enable camelcase */
      });

    return Plan.all(config)
      .then(res => {
        expect(res).to.have.property('plans');
        expect(res.plans).to.be.instanceof(Array);
        expect(res.cursor).to.eql('MjAyMy0wNy0yOFQwODowOT==');
        expect(res.has_more).to.eql(true);
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
