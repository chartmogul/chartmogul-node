'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const ExcludedCustomer = ChartMogul.ExcludedCustomer;

describe('ExcludedCustomer', () => {
  it('lists excluded customers with cursor pagination', async () => {
    /* eslint-disable camelcase */
    nock(config.API_BASE)
      .get('/v1/excluded_customers')
      .query({ per_page: 2, cursor: 'cursor==' })
      .reply(200, {
        entries: [
          {
            customer_uuid: 'cus_00000000-0000-0000-0000-000000000001',
            data_source_uuid: 'ds_00000000-0000-0000-0000-000000000001',
            external_id: 'ext-1',
            name: 'Acme',
            email: 'acme@example.com',
            excluded_at: '2026-11-20T10:00:00.000Z'
          },
          {
            customer_uuid: 'cus_00000000-0000-0000-0000-000000000001',
            data_source_uuid: 'ds_00000000-0000-0000-0000-000000000002',
            external_id: 'ext-2',
            name: 'Acme',
            email: 'acme@example.com',
            excluded_at: '2026-11-19T10:00:00.000Z'
          }
        ],
        cursor: 'next-cursor==',
        has_more: true
      });
    /* eslint-enable camelcase */

    const res = await ExcludedCustomer.all(config, { per_page: 2, cursor: 'cursor==' });
    expect(res.entries).to.have.lengthOf(2);
    expect(res.entries[0]).to.deep.equal({
      customer_uuid: 'cus_00000000-0000-0000-0000-000000000001',
      data_source_uuid: 'ds_00000000-0000-0000-0000-000000000001',
      external_id: 'ext-1',
      name: 'Acme',
      email: 'acme@example.com',
      excluded_at: '2026-11-20T10:00:00.000Z'
    });
    expect(res.entries[1].data_source_uuid).to.equal('ds_00000000-0000-0000-0000-000000000002');
    expect(res.cursor).to.equal('next-cursor==');
    expect(res.has_more).to.equal(true);
  });

  it('re-includes an excluded customer', async () => {
    const uuid = 'cus_00000000-0000-0000-0000-000000000001';

    nock(config.API_BASE)
      .delete(`/v1/excluded_customers/${uuid}`)
      .reply(202, { customer_uuid: uuid, status: 'reimporting' });

    const res = await ExcludedCustomer.reinclude(config, uuid);
    expect(res.customer_uuid).to.equal(uuid);
    expect(res.status).to.equal('reimporting');
  });

  it('rejects with a 404 when re-including a customer that is not excluded', () => {
    const uuid = 'cus_00000000-0000-0000-0000-000000000001';

    nock(config.API_BASE)
      .delete(`/v1/excluded_customers/${uuid}`)
      .reply(404, { code: 404, message: `Excluded customer "${uuid}" does not exist`, param: 'customer_uuid' });

    return ExcludedCustomer.reinclude(config, uuid)
      .then(() => { throw new Error('Expected rejection'); })
      .catch(e => {
        if (e.message === 'Expected rejection') throw e;
        expect(e.status).to.equal(404);
        expect(e.response.body.param).to.equal('customer_uuid');
      });
  });
});
