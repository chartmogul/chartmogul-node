'use strict';

const ChartMogul = require('../../../lib/chartmogul');
const expect = require('chai').expect;
const nock = require('nock');
const config = new ChartMogul.Config('token');
const retryRequest = require('../../../lib/chartmogul/util/retry');

describe('RetryTest', () => {
  config.retries = 2;
  const mockSuccessResponse = { success: true };

  it('should retry on network error and then succeed', done => {
    const query = { email: 'bob@acme.com' };

    nock(config.API_BASE)
      .get('/v1/metrics/all')
      .query(query)
      .replyWithError({ code: 'ECONNRESET' })
      .get('/v1/metrics/all')
      .query(query)
      .reply(200, mockSuccessResponse);

    const options = {
      uri: '/v1/metrics/all',
      baseUrl: config.API_BASE,
      method: 'GET',
      auth: {
        user: config.getApiKey(),
        pass: ''
      },
      qs: { email: 'bob@acme.com' },
      headers: {
        'User-Agent': 'chartmogul-node/' + config.VERSION
      }
    };

    retryRequest(config.retries, options, (err, res, body) => {
      expect(err).to.equal(null);
      expect(body).to.deep.equal(mockSuccessResponse);
      done();
    });
  });
});
