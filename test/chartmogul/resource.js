'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const ChartMogul = require('../../lib/chartmogul');
const Resource = require('../../lib/chartmogul/resource');
const Customer = require('../../lib/chartmogul/import/customer');

const config = new ChartMogul.Config('token', 'secret');

describe('Resource', () => {
  it('should send basicAuth headers', done => {
    nock(config.API_BASE)
      .get('/')
      .basicAuth({
        user: config.getAccountToken(),
        pass: config.getSecretKey()
      })
      .reply(200, 'OK');

    return Resource.request(config, 'GET', '/')
      .then(res => done())
      .catch(e => done(e));
  });

  const errorCodes = {
    400: 'SchemaInvalidError',
    401: 'ForbiddenError',
    403: 'ForbiddenError',
    404: 'NotFoundError',
    422: 'ResourceInvalidError',
    500: 'ChartMogulError'
  };
  Object.keys(errorCodes).forEach(function (code) {
    it(`should throw ${errorCodes[code]}`, done => {
      nock(config.API_BASE)
        .get('/')
        .reply(code, 'error message');
      return Resource.request(config, 'GET', '/')
        .then(res => done(new Error('Should throw error')))
        .catch(e => {
          expect(e).to.be.instanceOf(ChartMogul[errorCodes[code]]);
          expect(e.httpStatus).to.equal(Number(code));
          expect(e.response).to.equal('error message');
          done();
        });
    });
  });

  Object.keys(errorCodes).forEach(function (code) {
    it(`should throw ${errorCodes[code]} in callback`, done => {
      nock(config.API_BASE)
        .get('/')
        .reply(code, 'error message');

      return Resource.request(config, 'GET', '/', {}, (err, body) => {
        if (err) {
          expect(err).to.be.instanceOf(ChartMogul[errorCodes[code]]);
          expect(err.httpStatus).to.equal(Number(code));
          expect(err.response).to.equal('error message');
          done();
        } else {
          done(new Error('Should throw error'));
        }
      });
    });
  });

  it('should throw Error', done => {
    nock(config.API_BASE)
      .get('/')
      .replyWithError('something awful happened');
    return Resource.request(config, 'GET', '/')
      .then(res => done(new Error('Should throw error')))
      .catch(e => {
        expect(e).to.be.instanceOf(Error);
        done();
      });
  });

  it('should throw ResourceInvalidError', done => {
    nock(config.API_BASE)
      .get('/')
      .reply(422, 'error message');
    return Customer.request(config, 'GET', '/')
      .then(res => done(new Error('Should throw error')))
      .catch(e => {
        expect(e).to.be.instanceOf(ChartMogul.ResourceInvalidError);
        expect(e.httpStatus).to.equal(422);
        expect(e.response).to.equal('error message');
        expect(e.message)
          .to.equal('The Customer  could not be created or updated.');
        done();
      });
  });

  it('should throw ConfigurationError', done => {
    return Customer.all()
      .then(res => done(new Error('Should throw error')))
      .catch(e => {
        expect(e).to.be.instanceOf(ChartMogul.ConfigurationError);
        done();
      });
  });
});
