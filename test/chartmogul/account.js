'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const Account = ChartMogul.Account;

describe('Account', () => {
  it('should retrieve the details of current account', async () => {
    nock(config.API_BASE)
      .get('/v1/account')
      .reply(200, {
        /* eslint-disable camelcase */
        id: 'acc_a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Example Test Company',
        currency: 'EUR',
        time_zone: 'Europe/Berlin',
        week_start_on: 'sunday'
        /* eslint-enable camelcase */
      });

    const account = await Account.retrieve(config);
    expect(account.id).to.be.equal('acc_a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    expect(account.name).to.be.equal('Example Test Company');
    expect(account.currency).to.be.equal('EUR');
    expect(account.time_zone).to.be.equal('Europe/Berlin');
    expect(account.week_start_on).to.be.equal('sunday');
  });

  it('should retrieve account with include params', async () => {
    nock(config.API_BASE)
      .get('/v1/account')
      .query({
        /* eslint-disable camelcase */
        include: 'churn_recognition,churn_when_zero_mrr'
        /* eslint-enable camelcase */
      })
      .reply(200, {
        /* eslint-disable camelcase */
        id: 'acc_a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Example Test Company',
        currency: 'EUR',
        time_zone: 'Europe/Berlin',
        week_start_on: 'sunday',
        churn_recognition: 'immediate',
        churn_when_zero_mrr: true
        /* eslint-enable camelcase */
      });

    const account = await Account.retrieve(config, {
      include: 'churn_recognition,churn_when_zero_mrr'
    });
    expect(account.id).to.be.equal('acc_a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    expect(account.churn_recognition).to.be.equal('immediate');
    expect(account.churn_when_zero_mrr).to.be.equal(true);
  });

  it('should reject when retrieving account with invalid include param', () => {
    nock(config.API_BASE)
      .get('/v1/account')
      .query({ include: 'invalid_field' })
      .reply(400, { message: 'Invalid include parameter: invalid_field' });

    return Account.retrieve(config, { include: 'invalid_field' })
      .catch(e => {
        expect(e.status).to.equal(400);
      });
  });
});
