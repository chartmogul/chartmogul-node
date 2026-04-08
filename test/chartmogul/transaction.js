'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const Transaction = ChartMogul.Transaction;

describe('Transaction', () => {
  it('should create a transaction', () => {
    const invoiceUuid = 'inv_79eaad44-3379-4239-af83-2e0047dbebe6';

    /* eslint-disable camelcase */
    const postBody = {
      type: 'refund',
      date: '2015-12-25 18:10:00',
      result: 'successful'
    };
    /* eslint-enable camelcase */

    nock(config.API_BASE)
      .post(`/v1/import/invoices/${invoiceUuid}/transactions`)
      .reply(200, {
        /* eslint-disable camelcase */
        uuid: 'tr_73b392ce-f141-4d14-97f0-6baf93d8bf68',
        external_id: null,
        type: 'refund',
        date: '2015-12-25T18:10:00.000Z',
        result: 'successful'
        /* eslint-enable camelcase */
      });

    return Transaction.create(config, invoiceUuid, postBody)
      .then(res => {
        expect(res).to.have.property('uuid');
      });
  });

  it('should retrieve a transaction by UUID', () => {
    const uuid = 'tr_73b392ce-f141-4d14-97f0-6baf93d8bf68';

    /* eslint-disable camelcase */
    nock(config.API_BASE)
      .get(`/v1/transactions/${uuid}`)
      .reply(200, {
        uuid,
        external_id: 'trans_00241',
        type: 'refund',
        date: '2015-12-25T18:10:00.000Z',
        result: 'successful'
      });
    /* eslint-enable camelcase */

    return Transaction.retrieve(config, uuid)
      .then(res => {
        expect(res).to.have.property('uuid', uuid);
        expect(res.type).to.equal('refund');
      });
  });

  it('should update a transaction by UUID', () => {
    const uuid = 'tr_73b392ce-f141-4d14-97f0-6baf93d8bf68';

    nock(config.API_BASE)
      .patch(`/v1/transactions/${uuid}`)
      .reply(200, {
        uuid,
        result: 'failed'
      });

    return Transaction.modify(config, uuid, { result: 'failed' })
      .then(res => {
        expect(res.result).to.equal('failed');
      });
  });

  it('should delete a transaction by UUID', () => {
    const uuid = 'tr_73b392ce-f141-4d14-97f0-6baf93d8bf68';

    nock(config.API_BASE)
      .delete(`/v1/transactions/${uuid}`)
      .reply(204, {});

    return Transaction.destroy(config, uuid)
      .then(res => {
        expect(res).to.be.an('object');
      });
  });

  it('should disable a transaction by UUID', async () => {
    const uuid = 'tr_73b392ce-f141-4d14-97f0-6baf93d8bf68';
    let requestBody;

    nock(config.API_BASE)
      .patch(`/v1/transactions/${uuid}/disabled_state`, body => { requestBody = body; return true; })
      .reply(200, { uuid, disabled: true });

    const res = await Transaction.disable(config, uuid);
    expect(res.disabled).to.equal(true);
    expect(requestBody).to.deep.equal({ disabled: true });
  });

  it('should enable a transaction by UUID', async () => {
    const uuid = 'tr_73b392ce-f141-4d14-97f0-6baf93d8bf68';
    let requestBody;

    nock(config.API_BASE)
      .patch(`/v1/transactions/${uuid}/disabled_state`, body => { requestBody = body; return true; })
      .reply(200, { uuid, disabled: false });

    const res = await Transaction.enable(config, uuid);
    expect(res.disabled).to.equal(false);
    expect(requestBody).to.deep.equal({ disabled: false });
  });
});

/* eslint-disable camelcase */
const queryParams = {
  data_source_uuid: 'ds_fef05d54-47b4-431b-aed2-eb6b9e545430',
  external_id: 'tr_ext_001'
};

const transactionResponse = {
  uuid: 'tr_73b392ce-f141-4d14-97f0-6baf93d8bf68',
  external_id: 'tr_ext_001',
  type: 'payment',
  date: '2026-01-24T09:14:29.000Z',
  result: 'successful'
};
/* eslint-enable camelcase */

describe('Transaction query params', () => {
  it('should get transactions by data_source_uuid and external_id', () => {
    nock(config.API_BASE)
      .get('/v1/transactions')
      .query(queryParams)
      .reply(200, { transactions: [transactionResponse] });

    return Transaction.all(config, queryParams)
      .then(res => {
        expect(res.transactions).to.be.an('array');
        expect(res.transactions[0].external_id).to.equal('tr_ext_001');
      });
  });

  it('should update a transaction by query params', async () => {
    let requestBody;
    nock(config.API_BASE)
      .patch('/v1/transactions')
      .query(queryParams)
      .reply(200, (uri, body) => {
        requestBody = body;
        return { ...transactionResponse, result: 'failed' };
      });

    const res = await Transaction.update(config, {
      qs: queryParams,
      result: 'failed'
    });
    expect(res.result).to.equal('failed');
    expect(requestBody).to.have.property('result', 'failed');
    expect(requestBody).to.not.have.property('qs');
  });

  it('should delete a transaction by query params', async () => {
    nock(config.API_BASE)
      .delete('/v1/transactions')
      .query(queryParams)
      .reply(204, {});

    const res = await Transaction.destroyByExternalId(config, { qs: queryParams });
    expect(res).to.be.an('object');
  });

  it('should disable a transaction by query params', async () => {
    let requestBody;
    nock(config.API_BASE)
      .patch('/v1/transactions/disabled_state', body => { requestBody = body; return true; })
      .query(queryParams)
      .reply(200, { ...transactionResponse, disabled: true });

    const res = await Transaction.disableByExternalId(config, queryParams);
    expect(res.disabled).to.equal(true);
    expect(requestBody).to.deep.equal({ disabled: true });
  });

  it('should enable a transaction by query params', async () => {
    let requestBody;
    nock(config.API_BASE)
      .patch('/v1/transactions/disabled_state', body => { requestBody = body; return true; })
      .query(queryParams)
      .reply(200, { ...transactionResponse, disabled: false });

    const res = await Transaction.enableByExternalId(config, queryParams);
    expect(res.disabled).to.equal(false);
    expect(requestBody).to.deep.equal({ disabled: false });
  });
});
