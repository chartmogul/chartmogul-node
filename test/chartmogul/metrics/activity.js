'use strict';

const ChartMogul = require('../../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const Activity = ChartMogul.Metrics.Activity;

describe('Activity', () => {
  it('should retrieve all activities', () => {
    const query = {
      'start-date': '2020-01-01'
    };

    nock(config.API_BASE)
      .get('/v1/activities')
      .query(query)
      .reply(200, {
        entries: [
          {
            description: 'purchased the plan_11 plan',
            'activity-mrr-movement': 6000,
            'activity-mrr': 6000,
            'activity-arr': 72000,
            date: '2020-05-06T01:00:00',
            type: 'new_biz',
            currency: 'USD',
            'subscription-external-id': 'sub_2',
            'plan-external-id': '11',
            'customer-name': 'customer_2',
            'customer-uuid': '8bc55ab6-c3b5-11eb-ac45-2f9a49d75af7',
            'customer-external-id': 'customer_2',
            'billing-connector-uuid': '99076cb8-97a1-11eb-8798-a73b507e7929',
            uuid: 'f1a49735-21c7-4e3f-9ddc-67927aaadcf4'
          }
        ],
        has_more: false,
        cursor: 'cursor=='
      });
    return Activity.all(config, query)
      .then(res => {
        expect(res).to.have.property('entries');
        expect(res.entries).to.be.instanceof(Array);
        expect(res.has_more).to.eql(false);
        expect(res.cursor).to.eql('cursor==');
      });
  });
});
