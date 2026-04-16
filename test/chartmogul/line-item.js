'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const LineItem = ChartMogul.LineItem;

/* eslint-disable camelcase */
const queryParams = {
  data_source_uuid: 'ds_fef05d54-47b4-431b-aed2-eb6b9e545430',
  external_id: 'li_ext_001'
};

const lineItemResponse = {
  uuid: 'li_592f4699-107b-41b9-b7bc-a2aa2ca7a67b',
  external_id: 'li_ext_001',
  type: 'subscription',
  amount_in_cents: 10000,
  quantity: 1
};
/* eslint-enable camelcase */

describe('LineItem', () => {
  it('should create a line item', () => {
    const invoiceUuid = 'inv_79eaad44-3379-4239-af83-2e0047dbebe6';

    /* eslint-disable camelcase */
    const postBody = {
      type: 'subscription',
      amount_in_cents: 10000,
      quantity: 1,
      external_id: 'li_ext_id_00762',
      subscription_external_id: 'sub_added_line_item_via_api_1',
      plan_uuid: 'pl_3eb4efb2-d101-4dce-a664-be271b0da4de',
      service_period_start: '2022-11-01T00:00:00.000Z',
      service_period_end: '2022-12-01T00:00:00.000Z'
    };
    /* eslint-enable camelcase */

    nock(config.API_BASE)
      .post(`/v1/import/invoices/${invoiceUuid}/line_items`)
      .reply(200, {
        ...lineItemResponse,
        ...postBody
      });

    return LineItem.create(config, invoiceUuid, postBody)
      .then(res => {
        expect(res).to.have.property('uuid');
        expect(res.type).to.equal('subscription');
      });
  });

  it('should retrieve a line item by UUID', () => {
    const uuid = 'li_592f4699-107b-41b9-b7bc-a2aa2ca7a67b';

    nock(config.API_BASE)
      .get(`/v1/line_items/${uuid}`)
      .reply(200, lineItemResponse);

    return LineItem.retrieve(config, uuid)
      .then(res => {
        expect(res).to.have.property('uuid', uuid);
        expect(res.type).to.equal('subscription');
      });
  });

  it('should update a line item by UUID', () => {
    const uuid = 'li_592f4699-107b-41b9-b7bc-a2aa2ca7a67b';

    nock(config.API_BASE)
      .patch(`/v1/line_items/${uuid}`)
      .reply(200, { ...lineItemResponse, amount_in_cents: 20000 });

    return LineItem.modify(config, uuid, { amount_in_cents: 20000 })
      .then(res => {
        expect(res.amount_in_cents).to.equal(20000);
      });
  });

  it('should delete a line item by UUID', () => {
    const uuid = 'li_592f4699-107b-41b9-b7bc-a2aa2ca7a67b';

    nock(config.API_BASE)
      .delete(`/v1/line_items/${uuid}`)
      .reply(204, {});

    return LineItem.destroy(config, uuid)
      .then(res => {
        expect(res).to.be.an('object');
      });
  });

  it('should disable a line item by UUID', async () => {
    const uuid = 'li_592f4699-107b-41b9-b7bc-a2aa2ca7a67b';
    let requestBody;

    nock(config.API_BASE)
      .patch(`/v1/line_items/${uuid}/disabled_state`, body => { requestBody = body; return true; })
      .reply(200, { ...lineItemResponse, disabled: true });

    const res = await LineItem.disable(config, uuid);
    expect(res.disabled).to.equal(true);
    expect(requestBody).to.deep.equal({ disabled: true });
  });

  it('should enable a line item by UUID', async () => {
    const uuid = 'li_592f4699-107b-41b9-b7bc-a2aa2ca7a67b';
    let requestBody;

    nock(config.API_BASE)
      .patch(`/v1/line_items/${uuid}/disabled_state`, body => { requestBody = body; return true; })
      .reply(200, { ...lineItemResponse, disabled: false });

    const res = await LineItem.enable(config, uuid);
    expect(res.disabled).to.equal(false);
    expect(requestBody).to.deep.equal({ disabled: false });
  });

  it('should get line items by data_source_uuid and external_id', () => {
    nock(config.API_BASE)
      .get('/v1/line_items')
      .query(queryParams)
      .reply(200, { line_items: [lineItemResponse] });

    return LineItem.all(config, queryParams)
      .then(res => {
        expect(res.line_items).to.be.an('array');
        expect(res.line_items[0].external_id).to.equal('li_ext_001');
      });
  });

  it('should update a line item by query params', async () => {
    let requestBody;
    nock(config.API_BASE)
      .patch('/v1/line_items')
      .query(queryParams)
      .reply(200, (uri, body) => {
        requestBody = body;
        return { ...lineItemResponse, amount_in_cents: 20000 };
      });

    const res = await LineItem.update(config, {
      qs: queryParams,
      amount_in_cents: 20000
    });
    expect(res.amount_in_cents).to.equal(20000);
    expect(requestBody).to.have.property('amount_in_cents', 20000);
    expect(requestBody).to.not.have.property('qs');
  });

  it('should delete a line item by query params', async () => {
    nock(config.API_BASE)
      .delete('/v1/line_items')
      .query(queryParams)
      .reply(204, {});

    const res = await LineItem.destroyByExternalId(config, { qs: queryParams });
    expect(res).to.be.an('object');
  });

  it('should disable a line item by query params', async () => {
    let requestBody;
    nock(config.API_BASE)
      .patch('/v1/line_items/disabled_state', body => { requestBody = body; return true; })
      .query(queryParams)
      .reply(200, { ...lineItemResponse, disabled: true });

    const res = await LineItem.disableByExternalId(config, queryParams);
    expect(res.disabled).to.equal(true);
    expect(requestBody).to.deep.equal({ disabled: true });
  });

  it('should enable a line item by query params', async () => {
    let requestBody;
    nock(config.API_BASE)
      .patch('/v1/line_items/disabled_state', body => { requestBody = body; return true; })
      .query(queryParams)
      .reply(200, { ...lineItemResponse, disabled: false });

    const res = await LineItem.enableByExternalId(config, queryParams);
    expect(res.disabled).to.equal(false);
    expect(requestBody).to.deep.equal({ disabled: false });
  });
});
