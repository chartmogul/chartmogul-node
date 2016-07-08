'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token', 'secret');
const expect = require('chai').expect;
const nock = require('nock');
const Subscription = ChartMogul.Import.Subscription;

describe('Subscription', () => {
  it('should cancel a subscription', () => {
    const subscriptionUuid = 'sub_0c26db04-9b58-423f-9a3b-fec4a3a61a88';

    /* eslint-disable camelcase*/
    const postBody = {
      'cancelled_at': '2016-01-15 00:00:00'
    };
    /* eslint-enable camelcase*/

    nock(config.API_BASE)
      .patch(`/v1/import/subscriptions/${subscriptionUuid}`)
      .reply(200, {
        /* eslint-disable camelcase*/
        uuid: 'sub_0c26db04-9b58-423f-9a3b-fec4a3a61a88',
        external_id: 'sub_0001',
        cancellation_dates: [ '2016-01-15T00:00:00.000Z' ],
        customer_uuid: 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3',
        plan_uuid: 'pl_cff3a63c-3915-435e-a675-85a8a8ef4454',
        data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1'
        /* eslint-enable camelcase*/
      });

    return Subscription.cancel(config, subscriptionUuid, postBody)
    .then(res => {
      expect(res).to.have.property('cancellation_dates');
    });
  });

  it('should get all subscriptions', () => {
    const customerUUID = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';

    nock(config.API_BASE)
    .get('/v1/import/customers/' + customerUUID + '/subscriptions')
    .reply(200, {
      /* eslint-disable camelcase*/
      customer_uuid: 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3',
      subscriptions: [{
        uuid: 'sub_0c26db04-9b58-423f-9a3b-fec4a3a61a88',
        external_id: 'sub_0001',
        cancellation_dates: [],
        plan_uuid: 'pl_cff3a63c-3915-435e-a675-85a8a8ef4454',
        data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1'
      }],
      current_page: 1,
      total_pages: 1
      /* eslint-enable camelcase*/
    });

    return Subscription.all(config, customerUUID)
    .then(res => {
      expect(res).to.have.property('subscriptions');
      expect(res.subscriptions).to.be.instanceof(Array);
    });
  });
});
