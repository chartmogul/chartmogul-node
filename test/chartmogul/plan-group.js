'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token', 'secret');
const expect = require('chai').expect;
const nock = require('nock');
const PlanGroup = ChartMogul.PlanGroup;

describe('PlanGroup', () => {
  it('should create a new plan group', () => {
    /* eslint-disable camelcase */
    const postBody = {
      name: 'Bronze Plan Group',
      plans: ['pl_eed05d54-75b4-431b-adb2-eb6b9e543206', 'pl_ab225d54-7ab4-421b-cdb2-eb6b9e553462']
    };
    /* eslint-enable camelcase */

    nock(config.API_BASE)
      .post('/v1/plan_groups', postBody)
      .reply(200, {
        /* eslint-disable camelcase */
        name: 'Bronze Plan Group',
        uuid: 'plg_eed05d54-75b4-431b-adb2-eb6b9e543206',
        plans_count: 2
        /* eslint-enable camelcase */
      });

    return PlanGroup.create(config, postBody)
    .then(res => {
      expect(res).to.have.property('uuid');
      expect(res).to.have.property('name');
      expect(res).to.have.property('plans_count');
    });
  });

  it('should retrieve a single plan group', () => {
    const planGroupUUID = 'plg_eed05d54-75b4-431b-adb2-eb6b9e543206';

    nock(config.API_BASE)
    .get('/v1/plan_groups/' + planGroupUUID)
    .reply(200, {
      /* eslint-disable camelcase */
      name: 'Bronze Plan Group',
      uuid: 'plg_eed05d54-75b4-431b-adb2-eb6b9e543206',
      plans_count: 2
      /* eslint-enable camelcase */
    });

    return PlanGroup.retrieve(config, planGroupUUID, (err, res) => {
      if (err) {
        return err;
      }
      expect(res).to.have.property('uuid');
      expect(res).to.have.property('name');
      expect(res).to.have.property('plans_count');
    });
  });

  it('should get all plan groups', () => {
    nock(config.API_BASE)
    .get('/v1/plan_groups')
    .reply(200, {
      /* eslint-disable camelcase */
      plan_groups: [],
      current_page: 1,
      total_pages: 0
      /* eslint-enable camelcase */
    });

    return PlanGroup.all(config)
    .then(res => {
      expect(res).to.have.property('plan_groups');
      expect(res.plan_groups).to.be.instanceof(Array);
    });
  });

  it('should get all plans for a plan group', () => {
    const planGroupUUID = 'plg_eed05d54-75b4-431b-adb2-eb6b9e543206';

    nock(config.API_BASE)
    .get('/v1/plan_groups/' + planGroupUUID + '/plans')
    .reply(200, {
      /* eslint-disable camelcase */
      plans: [
        {
          uuid: 'pl_ab225d54-7ab4-421b-cdb2-eb6b9e553462',
          external_id: 'plan_0001',
          name: 'Bronze Plan',
          interval_count: 1,
          interval_unit: 'month',
          data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1'
        },
        {
          uuid: 'pl_eed05d54-75b4-431b-adb2-eb6b9e543206',
          external_id: 'plan_0001',
          name: 'Bronze Plan',
          interval_count: 1,
          interval_unit: 'month',
          data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1'
        }],
      current_page: 1,
      total_pages: 0
      /* eslint-enable camelcase */
    });

    return PlanGroup.all(config, planGroupUUID, (err, res) => {
      if (err) {
        return err;
      }
      expect(res).to.have.property('plans');
      expect(res.plans).to.be.instanceof(Array);
      expect(res.plans[0].uuid).to.be.equal('pl_ab225d54-7ab4-421b-cdb2-eb6b9e553462');
      expect(res.plans[1].uuid).to.be.equal('pl_eed05d54-75b4-431b-adb2-eb6b9e543206');
    });
  });

  it('should modify name of a plan group', () => {
    /* eslint-disable camelcase */
    const postBody = {
      name: 'new_name'
    };
    /* eslint-enable camelcase */
    nock(config.API_BASE)
    .patch('/v1/plan_groups/plg_eed05d54-75b4-431b-adb2-eb6b9e543206')
    .reply(200, {
      /* eslint-disable camelcase */
      name: 'new_name',
      uuid: 'plg_eed05d54-75b4-431b-adb2-eb6b9e543206',
      plans_count: 2
      /* eslint-enable camelcase */
    });

    return PlanGroup.modify(config, 'plg_eed05d54-75b4-431b-adb2-eb6b9e543206', postBody)
    .then(res => {
      expect(res).to.have.property('uuid');
      expect(res).to.have.property('name');
      expect(res.name).to.be.equal('new_name');
    });
  });

  it('should modify plans in a plan group', () => {
    /* eslint-disable camelcase */
    const postBody = {
      plans: ['pl_eed05d54-75b4-431b-adb2-eb6b9e543206']
    };
    /* eslint-enable camelcase */
    nock(config.API_BASE)
    .patch('/v1/plan_groups/plg_eed05d54-75b4-431b-adb2-eb6b9e543206')
    .reply(200, {
      /* eslint-disable camelcase */
      name: 'Bronze Plan Group',
      uuid: 'plg_eed05d54-75b4-431b-adb2-eb6b9e543206',
      plans_count: 1
      /* eslint-enable camelcase */
    });

    return PlanGroup.modify(config, 'plg_eed05d54-75b4-431b-adb2-eb6b9e543206', postBody)
    .then(res => {
      expect(res).to.have.property('uuid');
      expect(res).to.have.property('plans_count');
      expect(res.plans_count).to.be.equal(1);
    });
  });

  it('should delete a plan group', () => {
    nock(config.API_BASE)
    .delete('/v1/plan_groups/plg_eed05d54-75b4-431b-adb2-eb6b9e543206')
    .reply(200, {});

    return PlanGroup.destroy(config, 'plg_eed05d54-75b4-431b-adb2-eb6b9e543206')
    .then(res => {
      expect(res).to.be.deep.equal({});
    });
  });
});
