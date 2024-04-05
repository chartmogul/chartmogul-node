'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const SubscriptionEvent = ChartMogul.SubscriptionEvent;
const path = '/v1/subscription_events';

describe('SubscriptionEvent', () => {
  it('throws DeprecatedParamError if using old pagination parameter', async () => {
    const query = {
      page: 1
    };

    nock(config.API_BASE)
      .get(path)
      .query(query)
      .reply(200, {});
    return SubscriptionEvent.all(config, query)
      .catch(e => {
        expect(e.httpStatus).to.equal(422);
        expect(e.message).to.equal('"page" param is deprecated {}');
      });
  });

  it('should list all subscription events with pagination', () => {
    nock(config.API_BASE)
      .get(path)
      .reply(200, {
        subscription_events: [
          {
            id: 101,
            data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
            customer_external_id: '39530',
            subscription_set_external_id: null,
            subscription_external_id: 'subscription_39530',
            plan_external_id: 'gazillion_monthly',
            event_date: '2022-06-01T00:00:00Z',
            effective_date: '2022-06-02T00:00:00Z',
            event_type: 'subscription_cancelled',
            external_id: 'ex_id_1',
            errors: {},
            created_at: '2022-06-13T11:06:56Z',
            updated_at: '2022-06-13T12:19:40Z',
            quantity: null,
            currency: null,
            amount_in_cents: null,
            tax_amount_in_cents: null,
            retracted_event_id: null
          }
        ],
        cursor: 'cursor==',
        has_more: true
      });

    return SubscriptionEvent.all(config).then(res => {
      expect(res).to.have.property('subscription_events');
      expect(res).to.not.have.property('meta');
      expect(res.subscription_events[0]).to.have.property('data_source_uuid');
      expect(res.subscription_events[0].data_source_uuid).to.eq('ds_e243129a-12c0-4e29-8f54-07da7905fbd1');
      expect(res.cursor).to.eql('cursor==');
      expect(res.has_more).to.eql(true);
    });
  });

  it('should create a subscription event', () => {
    const postBody = {
      subscription_event: {
        customer_external_id: 'c_ex_id_1',
        data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
        effective_date: '2022-06-13T12:30:35.160Z',
        event_date: '2022-06-12T10:30:35.160Z',
        event_type: 'subscription_cancelled',
        external_id: 'ex_id_1',
        subscription_external_id: 'sub_ex_id_1'
      }
    };

    nock(config.API_BASE)
      .post(path)
      .reply(201, {
        subscription_event: {
          id: 101,
          data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
          customer_external_id: 'c_ex_id_1',
          subscription_set_external_id: null,
          subscription_external_id: 'sub_ex_id_1',
          plan_external_id: null,
          event_date: '2022-06-12T10:30:35.160Z',
          effective_date: '2022-06-13T12:30:35.160Z',
          event_type: 'subscription_cancelled',
          external_id: 'ex_id_1',
          errors: {},
          created_at: '2022-06-13T11:06:56Z',
          updated_at: '2022-06-13T12:19:40Z',
          quantity: null,
          currency: null,
          amount_in_cents: null,
          tax_amount_in_cents: null,
          retracted_event_id: null
        }
      });

    return SubscriptionEvent.create(config, postBody)
      .then(res => {
        expect(res).to.have.property('subscription_event');
      });
  });

  it('should update a subscription event using id', () => {
    const updateBody = {
      subscription_event: {
        id: 101,
        plan_external_id: 'gazillion_monthly_gold'
      }
    };

    nock(config.API_BASE)
      .patch(path)
      .reply(200, {
        subscription_event: {
          id: 101,
          data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
          customer_external_id: 'c_ex_id_1',
          subscription_set_external_id: null,
          subscription_external_id: 'sub_ex_id_1',
          plan_external_id: 'gazillion_monthly_gold',
          event_date: '2022-06-12T10:30:35.160Z',
          effective_date: '2022-06-13T12:30:35.160Z',
          event_type: 'subscription_cancelled',
          external_id: 'ex_id_1',
          errors: {},
          created_at: '2022-06-13T11:06:56Z',
          updated_at: '2022-06-13T12:19:40Z',
          quantity: null,
          currency: null,
          amount_in_cents: null,
          tax_amount_in_cents: null,
          retracted_event_id: null
        }
      });

    return SubscriptionEvent.updateWithParams(config, updateBody).then(res => {
      expect(res).to.have.property('subscription_event');
      expect(res.subscription_event.plan_external_id).to.eq('gazillion_monthly_gold');
    });
  });

  it('should update a subscription event using external_id and data_source_uuid', () => {
    const updateBody = {
      subscription_event: {
        external_id: 'ex_id_1',
        data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
        plan_external_id: 'gazillion_monthly_gold'
      }
    };

    nock(config.API_BASE)
      .patch(path)
      .reply(200, {
        subscription_event: {
          id: 101,
          data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
          customer_external_id: 'c_ex_id_1',
          subscription_set_external_id: null,
          subscription_external_id: 'sub_ex_id_1',
          plan_external_id: 'gazillion_monthly_gold',
          event_date: '2022-06-12T10:30:35.160Z',
          effective_date: '2022-06-13T12:30:35.160Z',
          event_type: 'subscription_cancelled',
          external_id: 'ex_id_1',
          errors: {},
          created_at: '2022-06-13T11:06:56Z',
          updated_at: '2022-06-13T12:19:40Z',
          quantity: null,
          currency: null,
          amount_in_cents: null,
          tax_amount_in_cents: null,
          retracted_event_id: null
        }
      });

    return SubscriptionEvent.updateWithParams(config, updateBody).then(res => {
      expect(res).to.have.property('subscription_event');
      expect(res.subscription_event.plan_external_id).to.eq('gazillion_monthly_gold');
    });
  });

  it('should delete a subscription event using id', () => {
    const deleteBody = {
      subscription_event: {
        id: 101
      }
    };

    nock(config.API_BASE)
      .delete(path)
      .reply(204, {});

    return SubscriptionEvent.deleteWithParams(config, deleteBody).then(res => {
      /* eslint-disable no-unused-expressions */
      expect(res).to.be.an('object').that.is.empty;
      /* eslint-enable no-unused-expressions */
    });
  });

  it('should delete a subscription event using external_id and data_source_uuid', () => {
    const deleteBody = {
      subscription_event: {
        external_id: 'ex_id_1',
        data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1'
      }
    };

    nock(config.API_BASE)
      .delete(path)
      .reply(204, {});

    return SubscriptionEvent.deleteWithParams(config, deleteBody).then(res => {
      /* eslint-disable no-unused-expressions */
      expect(res).to.be.an('object').that.is.empty;
      /* eslint-enable no-unused-expressions */
    });
  });
});
