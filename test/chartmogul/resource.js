"use strict";

const expect = require("chai").expect;
const nock = require('nock');
const Resource = require("../../lib/chartmogul/resource");
const Customer = require("../../lib/chartmogul/import/customer");
const ChartMogul = require("../../lib/chartmogul");

const config = new ChartMogul.Config('token', 'secret');

describe('Resource', () => {
  it('should send basicAuth headers', (done) => {
    nock(ChartMogul.API_BASE)
      .get('/')
      .basicAuth({
        user: config.getAccountToken(),
        pass: config.getSecretKey()
      })
      .reply(200, 'OK');
      
    return Resource.request(config, 'GET', '/')
      .then(res => done())
      .catch(e => done(e))
  });
  
  it('should throw SchemaInvalidError', (done) => {
    nock(ChartMogul.API_BASE)
      .get('/')
      .reply(400, 'error message');
    return Resource.request(config, 'GET', '/')
      .then(res => done(new Error('Should throw error')))
      .catch(e => {
        expect(e).to.be.instanceOf(ChartMogul.SchemaInvalidError);
        expect(e.httpStatus).to.equal(400);
        expect(e.response).to.equal('error message');
        done();
      })
  });
  
  it('should throw ResourceInvalidError', (done) => {
    nock(ChartMogul.API_BASE)
      .get('/')
      .reply(422, 'error message');
    return Customer.request(config, 'GET', '/')
      .then(res => done(new Error('Should throw error')))
      .catch(e => {
        expect(e).to.be.instanceOf(ChartMogul.ResourceInvalidError);
        expect(e.httpStatus).to.equal(422);
        expect(e.response).to.equal('error message');
        expect(e.message).to.equal('The Customer  could not be created or updated.');
        done();
      });
  });
});