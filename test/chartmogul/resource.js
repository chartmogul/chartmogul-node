'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const http = require('http');
const ChartMogul = require('../../lib/chartmogul');
const Resource = require('../../lib/chartmogul/resource');
const Customer = require('../../lib/chartmogul/customer');

describe('Resource', () => {
  const config = new ChartMogul.Config('token', 'secret');
  config.retries = 1; // retry once
  it('should send basicAuth headers', done => {
    nock(config.API_BASE)
      .get('/')
      .basicAuth({
        user: config.getAccountToken(),
        pass: config.getSecretKey()
      })
      .reply(200, 'OK');

    Resource.request(config, 'GET', '/')
      .then(res => done())
      .catch(e => done());
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
      if (code >= 500) { // retried request
        nock(config.API_BASE)
          .get('/')
          .reply(code, 'error message');
      }

      Resource.request(config, 'GET', '/')
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
      if (code >= 500) {
        nock(config.API_BASE)
          .get('/')
          .reply(code, 'error message');
      }

      Resource.request(config, 'GET', '/', {}, (err, body) => {
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

    Resource.request(config, 'GET', '/')
      .then(res => done(new Error('Should throw error')))
      .catch(e => {
        expect(e).to.be.instanceOf(Error);
        done();
      });
  });

  it('should throw ResourceInvalidError', done => {
    nock(config.API_BASE)
      .get('/')
      .reply(422, '{"error": "message"}');

    Customer.request(config, 'GET', '/')
      .then(res => done(new Error('Should throw error')))
      .catch(e => {
        expect(e).to.be.instanceOf(ChartMogul.ResourceInvalidError);
        expect(e.httpStatus).to.equal(422);
        expect(e.response.error).to.equal('message');
        expect(e.message)
          .to.equal('The Customer  could not be created or updated. {"error":"message"}');
        done();
      });
  });

  it('should throw ConfigurationError', done => {
    Customer.all()
      .then(res => done(new Error('Should throw error')))
      .catch(e => {
        expect(e).to.be.instanceOf(ChartMogul.ConfigurationError);
        done();
      });
  });
});

describe('Resource Retry', () => {
  const port = 12345;
  const config = new ChartMogul.Config('token', 'secret', `http://localhost:${port}`);
  let server, status, retry;

  before(done => {
    server = startMockServer(done);
  });
  after(done => server.close(done));

  it('should retry if status 429 is received', () => {
    retry = 1;
    status = 429;
    return Customer.all(config)
      .then(res => {
        expect(res).to.be.eql('ok');
        expect(retry).to.be.eql(0);
      });
  });
  it('should retry if status 500 is received', () => {
    retry = 1;
    status = 500;
    return Customer.all(config)
      .then(res => {
        expect(res).to.be.eql('ok');
        expect(retry).to.be.eql(0);
      });
  });

  it('should retry on ECONNRESET', () => {
    retry = 1;
    status = 0;
    return Customer.all(config)
      .then(res => {
        expect(res).to.be.eql('ok');
        expect(retry).to.be.eql(0);
      });
  });

  function startMockServer (cb = () => {}) {
    const server = http.createServer((req, res) => {
      if (retry <= 0) {
        return res.end('ok');
      }
      if (status === 0 && retry >= 0) {
        retry--;
        return req.socket.destroy(new Error('some error'));
      }
      retry--;
      res.writeHead(status);
      res.end(status.toString());
    });
    server.listen(port, cb);
    return server;
  }
});

