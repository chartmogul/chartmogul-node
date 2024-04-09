'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const Ping = ChartMogul.Ping;

describe('Ping', () => {
  it('should ping successfully', async () => {
    nock(config.API_BASE)
      .get('/v1/ping')
      .reply(200, {
        data: 'pong!'
      });

    const ping = await Ping.ping(config);
    expect(ping).to.have.property('data');
    expect(ping.data).to.equal('pong!');
  });
  it('should fail auth ping', async () => {
    const errorMsg = {
      code: 401,
      message: 'No valid API key provided',
      param: null
    };
    nock(config.API_BASE)
      .get('/v1/ping')
      .reply(401, errorMsg);

    await Ping.ping(config)
      .catch(e => {
        expect(e.status).to.equal(401);
        expect(e.message).to.equal('Unauthorized');
      });
  });
});
