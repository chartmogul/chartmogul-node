'use strict';
/** @deprecated Remove once module Enrichment is removed */

const ChartMogul = require('../../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const Customer = ChartMogul.Enrichment.Customer;

describe('DeprecatedEnrichment#Customer', () => {
  it('should retrieve a customer', () => {
    const customerUuid = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';

    nock(config.API_BASE)
      .get(`/v1/customers/${customerUuid}`)
      .reply(200, {
        /* eslint-disable camelcase */
        id: 244461,
        uuid: 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3',
        external_id: 'cus_0002',
        name: 'Adam Smith',
        email: 'adam@smith.com',
        status: 'Cancelled',
        'customer-since': '2015-11-01T00:00:00+00:00',
        attributes: { tags: [] },
        address:
        {
          country: 'United States',
          state: null,
          city: 'New York',
          address_line1: null,
          address_line2: null,
          address_zip: ''
        },
        mrr: 0,
        arr: 0,
        'billing-system-url': null,
        'chartmogul-url': 'https://app.chartmogul.com/#customers/244461-Adam_Smith',
        'billing-system-type': 'ImportApi',
        currency: 'USD',
        'currency-sign': '$'
        /* eslint-enable camelcase */
      });

    return Customer.retrieve(config, customerUuid)
      .then(res => {
        expect(res).to.have.property('uuid');
      });
  });

  it('should get all customers', () => {
    nock(config.API_BASE)
      .get('/v1/customers')
      .reply(200, {
      /* eslint-disable camelcase */
        entries: [],
        has_more: false,
        cursor: 'cursor=='
      /* eslint-enable camelcase */
      });

    return Customer.all(config)
      .then(res => {
        expect(res).to.have.property('entries');
        expect(res.entries).to.be.instanceof(Array);
        expect(res.cursor).to.eql('cursor==');
        expect(res.has_more).to.eql(false);
      });
  });

  it('should search for a customer', () => {
    const email = 'adam@smith.com';

    nock(config.API_BASE)
      .get('/v1/customers/search')
      .query({
        email
      })
      .reply(200, {
      /* eslint-disable camelcase */
        entries: [],
        has_more: false,
        cursor: 'cursor=='
      /* eslint-enable camelcase */
      });

    return Customer.search(config, {
      email
    })
      .then(res => {
        expect(res).to.have.property('entries');
        expect(res.entries).to.be.instanceof(Array);
        expect(res.cursor).to.eql('cursor==');
        expect(res.has_more).to.eql(false);
      });
  });

  it('should retrieve customer attributes', () => {
    const customerUuid = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';

    nock(config.API_BASE)
      .get(`/v1/customers/${customerUuid}/attributes`)
      .reply(200, {
      /* eslint-disable camelcase */
        tags: ['foo', 'bar']
      /* eslint-enable camelcase */
      });

    return Customer.attributes(config, customerUuid)
      .then(res => {
        expect(res).to.have.property('tags');
      });
  });

  it('should update a customer', () => {
    const customerUuid = 'cus_7e4e5c3d-832c-4fa4-bf77-6fdc8c6e14bc';

    /* eslint-disable camelcase */
    const postBody = {
      lead_created_at: '2014-01-15 00:00:00'
    };
    /* eslint-enable camelcase */

    nock(config.API_BASE)
      .patch(`/v1/customers/${customerUuid}`, postBody)
      .reply(200, {
        /* eslint-disable camelcase */
        uuid: 'cus_7e4e5c3d-832c-4fa4-bf77-6fdc8c6e14bc',
        external_id: 'cus_0001',
        name: 'Adam Smith',
        data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1'
        /* eslint-enable camelcase */
      });

    return Customer.patch(config, customerUuid, postBody)
      .then(res => {
        expect(res).to.have.property('uuid');
      });
  });

  it('should merge customers', () => {
    /* eslint-disable camelcase */
    const postBody = {
      from: { customer_uuid: 'cus_7e4e5c3d-832c-4fa4-bf77-6fdc8c6e14bc' },
      into: { customer_uuid: 'cus_ab223d54-75b4-431b-adb2-eb6b9e234571' }
    };
    /* eslint-enable camelcase */

    nock(config.API_BASE)
      .post('/v1/customers/merges', postBody)
      .reply(202, {});

    return Customer.merge(config, postBody)
      .then(res => {
        expect(202);
        expect(res).to.be.instanceof(Object);
      });
  });
});
