'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const Account = ChartMogul.Account;

describe('Account', () => {
  it('should retrieve the details of current account', () => {
    nock(config.API_BASE)
      .get('/v1/account')
      .reply(200, {
      /* eslint-disable camelcase */
        name: 'Example Test Company',
        currency: 'EUR',
        time_zone: 'Europe/Berlin',
        week_start_on: 'sunday'
      /* eslint-enable camelcase */
      });

    return Account.retrieve(config, (err, res) => {
      if (err) {
        return err;
      }
      expect(res.name).to.be.equal('Example Test Company');
      expect(res.currency).to.be.equal('EUR');
      expect(res.time_zone).to.be.equal('Europe/Berlin');
      expect(res.week_start_on).to.be.equal('sunday');
    });
  });
});
