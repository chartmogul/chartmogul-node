'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token', 'secret');
const expect = require('chai').expect;
const nock = require('nock');
const Customer = ChartMogul.Customer;

describe('Customer', () => {
  it('should create a new customer', () => {
    const postBody = {
      /* eslint-disable camelcase */
      data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
      external_id: 'cus_0002',
      name: 'Adam Smith',
      email: 'adam@smith.com',
      country: 'US',
      city: 'New York'
      /* eslint-enable camelcase */
    };

    nock(config.API_BASE)
      .post('/v1/customers', postBody)
      .reply(200, {
        /* eslint-disable camelcase */
        uuid: 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3',
        external_id: 'cus_0002',
        name: 'Adam Smith',
        company: '',
        email: 'adam@smith.com',
        city: 'New York',
        state: '',
        country: 'US',
        zip: '',
        data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1'
        /* eslint-enable camelcase */
      });

    Customer.create(config, postBody)
    .then(res => {
      expect(res).to.have.property('uuid');
    });
  });

  it('should get all customers', () => {
    nock(config.API_BASE)
    .get('/v1/customers')
    .reply(200, {
      /* eslint-disable camelcase */
      customers: [{
        uuid: 'cus_7e4e5c3d-832c-4fa4-bf77-6fdc8c6e14bc',
        external_id: 'cus_0001',
        name: 'Adam Smith',
        company: '',
        email: 'adam@smith.com',
        city: 'New York',
        state: '',
        country: 'US',
        zip: '',
        data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1'
      }]
      /* eslint-enable camelcase */
    });

    return Customer.all(config)
    .then(res => {
      expect(res).to.have.property('customers');
      expect(res.customers).to.be.instanceof(Array);
    });
  });

  it('should delete a customer', () => {
    const uuid = 'cus_7e4e5c3d-832c-4fa4-bf77-6fdc8c6e14bc';

    nock(config.API_BASE)
    .delete('/v1/customers' + '/' + uuid)
    .reply(204);

    return Customer.destroy(config, uuid);
  });
});

/** Suite that originally belonged in the Enrichment module.
 */
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

  it('should update a customer', () => {
    const customerUuid = 'cus_7e4e5c3d-832c-4fa4-bf77-6fdc8c6e14bc';

    /* eslint-disable camelcase */
    const postBody = {
      'lead_created_at': '2014-01-15 00:00:00'
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
      'from': {'customer_uuid': 'cus_7e4e5c3d-832c-4fa4-bf77-6fdc8c6e14bc'},
      'into': {'customer_uuid': 'cus_ab223d54-75b4-431b-adb2-eb6b9e234571'}
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
  it('should connect subscriptions', () => {
    const customerUuid = 'cus_7e4e5c3d-832c-4fa4-bf77-6fdc8c6e14bc';
    /* eslint-disable camelcase */
    const postBody = {
      subscriptions: [{
        data_source_uuid: 'ds_ade45e52-47a4-231a-1ed2-eb6b9e541213',
        external_id: 'd1c0c885-add0-48db-8fa9-0bdf5017d6b0'
      },
        {
          data_source_uuid: 'ds_ade45e52-47a4-231a-1ed2-eb6b9e541213',
          external_id: '9db5f4a1-1695-44c0-8bd4-de7ce4d0f1d4'
        }
      ]
    };
    /* eslint-enable camelcase */

    nock(config.API_BASE)
      .post(`/v1/customers/${customerUuid}/connect_subscriptions`, postBody)
      .reply(202, {});

    return Customer.connectSubscriptions(config, customerUuid, postBody)
    .then(res => {
      expect(202);
      expect(res).to.be.instanceof(Object);
    });
  });
});
