'use strict';

const ChartMogul = require('../../../lib/chartmogul');
const config = new ChartMogul.Config('token', 'secret');
const expect = require('chai').expect;
const nock = require('nock');
const Customer = ChartMogul.Enrichment.Customer;

describe('Enrichment#Customer', () => {
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
         { country: 'United States',
           state: null,
           city: 'New York',
           address_line1: null,
           address_line2: null,
           address_zip: '' },
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
      per_page: 200,
      page: 1
      /* eslint-enable camelcase */
    });

    return Customer.all(config)
    .then(res => {
      expect(res).to.have.property('entries');
      expect(res.entries).to.be.instanceof(Array);
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
      per_page: 200,
      page: 1
      /* eslint-enable camelcase */
    });

    return Customer.search(config, {
      email
    })
    .then(res => {
      expect(res).to.have.property('entries');
      expect(res.entries).to.be.instanceof(Array);
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
});
