/* global fail */

'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token', 'secret');
const expect = require('chai').expect;
const nock = require('nock');
const Ping = ChartMogul.Ping;

describe('Ping', () => {
  it('should ping successfully', (done) => {
    nock(config.API_BASE)
      .get('/v1/ping')
      .reply(200, {
        data: 'pong!'
      });

    Ping.ping(config)
      .then(res => {
        expect(res).to.have.property('data');
        done();
      });
  });
  it('should fail auth ping', (done) => {
    const errorMsg = {
      code: 401,
      message: 'No valid API key provided',
      param: null
    };
    nock(config.API_BASE)
      .get('/v1/ping')
      .reply(401, errorMsg);

    Ping.ping(config)
      .then(res => {
        fail("Shouldn't succeed!");
      })
      .catch(() => {
        done();
      });
  });
});
