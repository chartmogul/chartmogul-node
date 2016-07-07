'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('49d974a13658245259899b955ebfba90', 'b009838a8e690d821ea3b76657a6cc58');
const expect = require('chai').expect;
const nock = require('nock');
const Transaction = ChartMogul.Import.Transaction;

describe('Transaction', () => {
  it('should create a transaction', () => {
    const invoiceUuid = 'inv_79eaad44-3379-4239-af83-2e0047dbebe6';

    /* eslint-disable camelcase*/
    const postBody = {
      'type': 'refund',
      'date': '2015-12-25 18:10:00',
      'result': 'successful'
    };
    /* eslint-enable camelcase*/

    nock(config.API_BASE)
      .post(`/v1/import/invoices/${invoiceUuid}/transactions`)
      .reply(200, {
        /* eslint-disable camelcase*/
        uuid: 'tr_73b392ce-f141-4d14-97f0-6baf93d8bf68',
        external_id: null,
        type: 'refund',
        date: '2015-12-25T18:10:00.000Z',
        result: 'successful'
        /* eslint-enable camelcase*/
      });

    return Transaction.create(config, invoiceUuid, postBody)
    .then(res => {
      expect(res).to.have.property('uuid');
    });
  });
});
