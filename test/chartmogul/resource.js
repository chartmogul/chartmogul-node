'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const http = require('http');
const ChartMogul = require('../../lib/chartmogul');
const Resource = require('../../lib/chartmogul/resource');
const Customer = require('../../lib/chartmogul/customer');

describe('Resource', () => {
  const config = new ChartMogul.Config('token');
  config.retries = 0; // no retry

  it('should send basicAuth headers', done => {
    nock(config.API_BASE)
      .get('/')
      .basicAuth({
        user: config.getApiKey(),
        pass: ''
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
        .reply(Number(code), 'error message');

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
        .reply(Number(code), 'error message');

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
        expect(e.message).to.equal(
          'The Customer  could not be created or updated. {"error":"message"}'
        );
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

  it('should throw InvalidParameterError', done => {
    nock(config.API_BASE)
      .get('/customers?page=1')
      .reply(200, '{}');

    Customer.all(config, { page: 1 })
      .then(res => done(new Error('Should throw error')))
      .catch(e => {
        expect(e).to.be.instanceOf(ChartMogul.ConfigurationError);
        done();
      });
  });
});

describe('Resource Retry', () => {
  const port = 12345;
  const config = new ChartMogul.Config(
    'token',
    `http://localhost:${port}`
  );
  let server, status, retry;

  before(done => {
    server = startMockServer(done);
  });
  after(done => server.close(done));

  it('should retry if status 429 is received', () => {
    retry = 1;
    status = 429;
    return Customer.all(config).then(res => {
      expect(res).to.be.eql('ok');
      expect(retry).to.be.eql(0);
    });
  });
  it('should retry if status 500 is received', () => {
    retry = 1;
    status = 500;
    return Customer.all(config).then(res => {
      expect(res).to.be.eql('ok');
      expect(retry).to.be.eql(0);
    });
  });

  it('should retry on ECONNRESET', () => {
    retry = 1;
    status = 0;
    return Customer.all(config).then(res => {
      expect(res).to.be.eql('ok');
      expect(retry).to.be.eql(0);
    });
  });

  // mock server used to send server errors to let the client retry
  // it will send several 5xx status and finally sends a 200 status
  // so clients can retry on 5xx status codes
  function startMockServer (cb) {
    cb = cb || function () {};
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
