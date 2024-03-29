'use strict';
/** @deprecated Remove once module Enrichment is removed */

const ChartMogul = require('../../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const Invoice = ChartMogul.Import.Invoice;

/* eslint-disable camelcase */
const postBody = {
  invoices: [{
    external_id: 'INV0001',
    date: '2015-11-01 00:00:00',
    currency: 'USD',
    due_date: '2015-11-15 00:00:00',
    line_items: [
      {
        type: 'subscription',
        subscription_external_id: 'sub_0001',
        plan_uuid: 'pl_cff3a63c-3915-435e-a675-85a8a8ef4454',
        service_period_start: '2015-11-01 00:00:00',
        service_period_end: '2015-12-01 00:00:00',
        amount_in_cents: 5000,
        quantity: 1,
        discount_code: 'PSO86',
        discount_amount_in_cents: 1000,
        tax_amount_in_cents: 900,
        transaction_fees_currency: 'EUR',
        discount_description: '5 EUR',
        event_order: 5
      },
      {
        type: 'one_time',
        description: 'Setup Fees',
        amount_in_cents: 2500,
        quantity: 1,
        discount_code: 'PSO86',
        discount_amount_in_cents: 500,
        tax_amount_in_cents: 450,
        transaction_fees_currency: 'EUR',
        discount_description: '2 EUR'
      }
    ],
    transactions: [
      {
        date: '2015-11-05 00:14:23',
        type: 'payment',
        result: 'successful'
      }
    ]
  }]
};
/* eslint-enable camelcase */

describe('DeprecatedCustomerInvoice', () => {
  it('should create a customer invoice', () => {
    const customerUUID = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';

    nock(config.API_BASE)
      .post('/v1/import/customers/' + customerUUID + '/invoices')
      .reply(200, {
        /* eslint-disable camelcase */
        invoices: [{
          uuid: 'inv_79eaad44-3379-4239-af83-2e0047dbebe6',
          external_id: 'INV0001',
          date: '2015-11-01T00:00:00.000Z',
          due_date: '2015-11-15T00:00:00.000Z',
          currency: 'USD',
          line_items: [],
          transactions: []
        }]
        /* eslint-enable camelcase */
      });

    return Invoice.create(config, customerUUID, postBody)
      .then(res => {
        expect(res).to.have.property('invoices');
      });
  });

  it('should create a customer invoice using callback', done => {
    const customerUUID = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';

    nock(config.API_BASE)
      .post('/v1/import/customers/' + customerUUID + '/invoices')
      .reply(200, {
        /* eslint-disable camelcase */
        invoices: [{
          uuid: 'inv_79eaad44-3379-4239-af83-2e0047dbebe6',
          external_id: 'INV0001',
          date: '2015-11-01T00:00:00.000Z',
          due_date: '2015-11-15T00:00:00.000Z',
          currency: 'USD',
          line_items: [],
          transactions: []
        }]
        /* eslint-enable camelcase */
      });

    Invoice.create(config, customerUUID, postBody, (err, res) => {
      if (err) {
        return done(err);
      }
      expect(res).to.have.property('invoices');
      done();
    });
  });

  it('should get all customer invoices with old pagination', () => {
    const customerUUID = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';

    nock(config.API_BASE)
      .get('/v1/import/customers/' + customerUUID + '/invoices')
      .reply(200, {
      /* eslint-disable camelcase */
        customer_uuid: 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3',
        invoices: [],
        current_page: 1,
        total_pages: 1
      /* eslint-enable camelcase */
      });

    return Invoice.all(config, customerUUID)
      .then(res => {
        expect(res).to.have.property('invoices');
        expect(res.invoices).to.be.instanceof(Array);
        expect(res.current_page).to.eql(1);
        expect(res.total_pages).to.eql(1);
      });
  });

  it('should get all customer invoices with new pagination', () => {
    const customerUUID = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';

    nock(config.API_BASE)
      .get('/v1/import/customers/' + customerUUID + '/invoices')
      .reply(200, {
      /* eslint-disable camelcase */
        customer_uuid: 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3',
        invoices: [],
        cursor: 'cursor==',
        has_more: false
      /* eslint-enable camelcase */
      });

    return Invoice.all(config, customerUUID)
      .then(res => {
        expect(res).to.have.property('invoices');
        expect(res.invoices).to.be.instanceof(Array);
        expect(res.cursor).to.eql('cursor==');
        expect(res.has_more).to.eql(false);
      });
  });

  it('should get all customer invoices in callback (old pagination)', done => {
    const customerUUID = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';

    nock(config.API_BASE)
      .get('/v1/import/customers/' + customerUUID + '/invoices')
      .reply(200, {
      /* eslint-disable camelcase */
        customer_uuid: 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3',
        invoices: [],
        current_page: 1,
        total_pages: 1
      /* eslint-enable camelcase */
      });

    Invoice.all(config, customerUUID, (err, res) => {
      if (err) {
        return done(err);
      }
      expect(res).to.have.property('invoices');
      expect(res.invoices).to.be.instanceof(Array);
      expect(res.current_page).to.eql(1);
      expect(res.total_pages).to.eql(1);
      done();
    });
  });

  it('should get all customer invoices in callback (new pagination)', done => {
    const customerUUID = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';

    nock(config.API_BASE)
      .get('/v1/import/customers/' + customerUUID + '/invoices')
      .reply(200, {
      /* eslint-disable camelcase */
        customer_uuid: 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3',
        invoices: [],
        cursor: 'cursor==',
        has_more: false
      /* eslint-enable camelcase */
      });

    Invoice.all(config, customerUUID, (err, res) => {
      if (err) {
        return done(err);
      }
      expect(res).to.have.property('invoices');
      expect(res.invoices).to.be.instanceof(Array);
      expect(res.cursor).to.eql('cursor==');
      expect(res.has_more).to.eql(false);
      done();
    });
  });
});
