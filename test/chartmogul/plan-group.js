'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
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

  it('should retrieve a single plan group', async () => {
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

    const planGroup = await PlanGroup.retrieve(config, planGroupUUID);
    expect(planGroup).to.have.property('uuid');
    expect(planGroup).to.have.property('name');
    expect(planGroup).to.have.property('plans_count');
  });

  it('throws DeprecatedParamError if using old pagination parameter', async () => {
    const query = {
      page: 1
    };

    nock(config.API_BASE)
      .get('/v1/plan_groups')
      .query(query)
      .reply(200, {});
    return PlanGroup.all(config, query)
      .catch(e => {
        expect(e).to.be.instanceOf(ChartMogul.DeprecatedParamError);
        expect(e.httpStatus).to.equal(422);
        expect(e.message).to.equal('"page" param is deprecated {}');
      });
  });

  it('should get all plan groups with pagination', async () => {
    nock(config.API_BASE)
      .get('/v1/plan_groups')
      .reply(200, {
      /* eslint-disable camelcase */
        plan_groups: [],
        cursor: 'cursor==',
        has_more: false
      /* eslint-enable camelcase */
      });

    const planGroup = await PlanGroup.all(config);
    expect(planGroup).to.have.property('plan_groups');
    expect(planGroup.plan_groups).to.be.instanceof(Array);
    expect(planGroup.cursor).to.eql('cursor==');
    expect(planGroup.has_more).to.eql(false);
  });

  it('should get all plans for a plan group with pagination', async () => {
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
        cursor: 'cursor==',
        has_more: false
      /* eslint-enable camelcase */
      });

    const planGroup = await PlanGroup.all(config, planGroupUUID);
    expect(planGroup).to.have.property('plans');
    expect(planGroup.plans).to.be.instanceof(Array);
    expect(planGroup.plans[0].uuid).to.be.equal('pl_ab225d54-7ab4-421b-cdb2-eb6b9e553462');
    expect(planGroup.plans[1].uuid).to.be.equal('pl_eed05d54-75b4-431b-adb2-eb6b9e543206');
    expect(planGroup.cursor).to.eql('cursor==');
    expect(planGroup.has_more).to.eql(false);
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
