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

  it('should send basicAuth headers', async () => {
    nock(config.API_BASE)
      .get('/')
      .basicAuth({
        user: config.getApiKey(),
        pass: ''
      })
      .reply(200, 'OK');

    const resource = await Resource.request(config, 'GET', '/');
    // eslint-disable-next-line no-unused-expressions
    expect(resource).to.empty;
  });

  const errorCodes = [
    { code: 400, value: 'Bad Request', error: 'SchemaInvalidError' },
    { code: 401, value: 'Unauthorized', error: 'ForbiddenError' },
    { code: 403, value: 'Forbidden', error: 'ForbiddenError' },
    { code: 404, value: 'Not Found', error: 'NotFoundError' },
    { code: 500, value: 'Internal Server Error', error: 'ChartMogulError' }
  ];

  errorCodes.forEach(function (error) {
    it(`should throw ${error.value}`, async () => {
      nock(config.API_BASE)
        .get('/')
        .reply(Number(error.code), error.value);

      await Resource.request(config, 'GET', '/')
        .catch(e => {
          expect(e.status).to.equal(Number(error.code));
          expect(e.message).to.equal(error.value);
        });
    });
  });

  it('should throw Error', async () => {
    nock(config.API_BASE)
      .get('/')
      .reply(200, 'something awful happened');

    await Resource.request(config, 'GET', '/')
      .catch(e => {
        expect(e).to.be.equal('something awful happened');
      });
  });

  it('should throw ResourceInvalidError', async () => {
    nock(config.API_BASE)
      .get('/')
      .reply(422, '{"error": "message"}');

    await Customer.request(config, 'GET', '/')
      .catch(e => {
        expect(e.status).to.equal(422);
        expect(e.response.text).to.equal('{"error": "message"}');
      });
  });

  it('should throw ConfigurationError', async () => {
    await Customer.all()
      .catch(e => {
        expect(e).to.be.instanceOf(ChartMogul.ConfigurationError);
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

  config.retries = 1;

  before(async () => {
    server = await startMockServer();
  });
  after(async () => await server.close());

  it('should retry if status 429 is received', async () => {
    retry = 1;
    status = 429;
    await Customer.all(config)
      .catch(e => {
        expect(retry).to.be.eql(0);
        expect(e).to.be.eql('ok');
      });
  });

  it('should retry if status 500 is received', async () => {
    retry = 1;
    status = 500;

    await Customer.all(config)
      .catch(e => {
        expect(e).to.be.eql('ok');
        expect(retry).to.be.eql(0);
      });
  });

  it('should retry on ECONNRESET', async () => {
    retry = 1;
    status = 0;

    await Customer.all(config)
      .catch(e => {
        expect(e).to.be.eql('ok');
        expect(retry).to.be.eql(0);
      });
  });

  // mock server used to send server errors to let the client retry
  // it will send several 5xx status and finally sends a 200 status
  // so clients can retry on 5xx status codes
  function startMockServer() {
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
    server.listen(port);
    return server;
  }
});
