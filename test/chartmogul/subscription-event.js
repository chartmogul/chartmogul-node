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
      .then(() => { throw new Error('Expected rejection'); })
      .catch(e => {
        if (e.message === 'Expected rejection') throw e;
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

  it('should create a subscription event with flat params and wrap in envelope', async () => {
    const flatParams = {
      customer_external_id: 'c_ex_id_1',
      data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
      effective_date: '2022-06-13T12:30:35.160Z',
      event_date: '2022-06-12T10:30:35.160Z',
      event_type: 'subscription_cancelled',
      external_id: 'ex_id_1',
      subscription_external_id: 'sub_ex_id_1'
    };

    let requestBody;
    nock(config.API_BASE)
      .post(path, body => { requestBody = body; return true; })
      .reply(201, {
        subscription_event: {
          id: 101,
          external_id: 'ex_id_1'
        }
      });

    const res = await SubscriptionEvent.create(config, flatParams);
    expect(res).to.have.property('subscription_event');
    expect(requestBody).to.have.property('subscription_event');
    expect(requestBody.subscription_event.customer_external_id).to.eq('c_ex_id_1');
  });

  it('should create a subscription event with envelope params (backward compat)', async () => {
    const envelopeParams = {
      subscription_event: {
        customer_external_id: 'c_ex_id_1',
        data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
        event_type: 'subscription_cancelled',
        external_id: 'ex_id_1',
        subscription_external_id: 'sub_ex_id_1'
      }
    };

    let requestBody;
    nock(config.API_BASE)
      .post(path, body => { requestBody = body; return true; })
      .reply(201, {
        subscription_event: {
          id: 101,
          external_id: 'ex_id_1'
        }
      });

    const res = await SubscriptionEvent.create(config, envelopeParams);
    expect(res).to.have.property('subscription_event');
    expect(requestBody).to.have.property('subscription_event');
    expect(requestBody.subscription_event.customer_external_id).to.eq('c_ex_id_1');
    // Should NOT double-wrap
    expect(requestBody.subscription_event).to.not.have.property('subscription_event');
  });

  it('should update a subscription event wrapping flat params with id', async () => {
    const flatParams = {
      id: 101,
      plan_external_id: 'gazillion_monthly_gold'
    };

    let requestBody;
    nock(config.API_BASE)
      .patch(path, body => { requestBody = body; return true; })
      .reply(200, {
        subscription_event: {
          id: 101,
          plan_external_id: 'gazillion_monthly_gold'
        }
      });

    const res = await SubscriptionEvent.updateWithParams(config, flatParams);
    expect(res.subscription_event.plan_external_id).to.eq('gazillion_monthly_gold');
    expect(requestBody).to.have.property('subscription_event');
    expect(requestBody.subscription_event.id).to.eq(101);
  });

  it('should update a subscription event wrapping flat params with external_id', async () => {
    const flatParams = {
      external_id: 'ex_id_1',
      data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
      plan_external_id: 'gazillion_monthly_gold'
    };

    let requestBody;
    nock(config.API_BASE)
      .patch(path, body => { requestBody = body; return true; })
      .reply(200, {
        subscription_event: {
          id: 101,
          plan_external_id: 'gazillion_monthly_gold'
        }
      });

    const res = await SubscriptionEvent.updateWithParams(config, flatParams);
    expect(res.subscription_event.plan_external_id).to.eq('gazillion_monthly_gold');
    expect(requestBody).to.have.property('subscription_event');
    expect(requestBody.subscription_event.external_id).to.eq('ex_id_1');
  });

  it('should delete a subscription event wrapping flat params with id', async () => {
    const flatParams = {
      id: 101
    };

    let requestBody;
    nock(config.API_BASE)
      .delete(path, body => { requestBody = body; return true; })
      .reply(204, {});

    const res = await SubscriptionEvent.deleteWithParams(config, flatParams);
    /* eslint-disable no-unused-expressions */
    expect(res).to.be.an('object').that.is.empty;
    /* eslint-enable no-unused-expressions */
    expect(requestBody).to.have.property('subscription_event');
    expect(requestBody.subscription_event.id).to.eq(101);
  });

  it('should delete a subscription event wrapping flat params with external_id', async () => {
    const flatParams = {
      external_id: 'ex_id_1',
      data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1'
    };

    let requestBody;
    nock(config.API_BASE)
      .delete(path, body => { requestBody = body; return true; })
      .reply(204, {});

    const res = await SubscriptionEvent.deleteWithParams(config, flatParams);
    /* eslint-disable no-unused-expressions */
    expect(res).to.be.an('object').that.is.empty;
    /* eslint-enable no-unused-expressions */
    expect(requestBody).to.have.property('subscription_event');
    expect(requestBody.subscription_event.external_id).to.eq('ex_id_1');
  });

  it('should create a subscription event with callback', (done) => {
    nock(config.API_BASE)
      .post(path, body => body.subscription_event)
      .reply(201, {
        subscription_event: { id: 102, external_id: 'ex_cb_1' }
      });

    SubscriptionEvent.create(config, {
      customer_external_id: 'c_ex_id_1',
      data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
      event_type: 'subscription_cancelled',
      external_id: 'ex_cb_1',
      subscription_external_id: 'sub_ex_id_1'
    }, (err, res) => {
      if (err) return done(err);
      expect(res).to.have.property('subscription_event');
      expect(res.subscription_event.external_id).to.eq('ex_cb_1');
      done();
    });
  });

  it('should disable a subscription event', () => {
    nock(config.API_BASE)
      .patch('/v1/subscription_events/101/disable')
      .reply(200, {
        subscription_event: {
          id: 101,
          disabled: true
        }
      });

    return SubscriptionEvent.disable(config, 101).then(res => {
      expect(res.subscription_event.disabled).to.eq(true);
    });
  });

  it('should enable a subscription event', () => {
    nock(config.API_BASE)
      .patch('/v1/subscription_events/101/enable')
      .reply(200, {
        subscription_event: {
          id: 101,
          disabled: false
        }
      });

    return SubscriptionEvent.enable(config, 101).then(res => {
      expect(res.subscription_event.disabled).to.eq(false);
    });
  });

  it('should reject when disabling nonexistent event', () => {
    nock(config.API_BASE)
      .patch('/v1/subscription_events/999/disable')
      .reply(404, { message: 'Subscription event not found' });

    return SubscriptionEvent.disable(config, 999)
      .then(() => { throw new Error('Expected rejection'); })
      .catch(e => {
        if (e.message === 'Expected rejection') throw e;
        expect(e.status).to.equal(404);
      });
  });

  it('should reject when enabling nonexistent event', () => {
    nock(config.API_BASE)
      .patch('/v1/subscription_events/999/enable')
      .reply(404, { message: 'Subscription event not found' });

    return SubscriptionEvent.enable(config, 999)
      .then(() => { throw new Error('Expected rejection'); })
      .catch(e => {
        if (e.message === 'Expected rejection') throw e;
        expect(e.status).to.equal(404);
      });
  });
});
