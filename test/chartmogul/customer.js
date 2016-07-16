'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token', 'secret');
const expect = require('chai').expect;
const nock = require('nock');
const Customer = ChartMogul.Import.Customer;

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
      .post('/v1/import/customers', postBody)
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
    .get('/v1/import/customers')
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
    .delete('/v1/import/customers' + '/' + uuid)
    .reply(204);

    return Customer.destroy(config, uuid);
  });
});
