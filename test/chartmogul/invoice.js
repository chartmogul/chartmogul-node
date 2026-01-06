'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const Invoice = ChartMogul.Invoice;

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

const invoiceListResult = {
  invoices: [{
    external_id: 'INV0001',
    date: '2015-11-01 00:00:00',
    currency: 'USD',
    customer_uuid: 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3',
    due_date: '2015-11-15 00:00:00',
    disabled: false,
    disabled_at: null,
    disabled_by: null,
    edit_history_summary: {
      values_changed: {
        amount_in_cents: {
          original_value: 4500,
          edited_value: 5000
        }
      },
      latest_edit_author: 'admin@example.com',
      latest_edit_performed_at: '2024-01-10T12:00:00.000Z'
    },
    errors: null,
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
  }],
  cursor: 'cursor==',
  has_more: false
};
/* eslint-enable camelcase */

describe('Customer Invoice', () => {
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

  it('should create a customer invoice using callback', async () => {
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

    const invoice = await Invoice.create(config, customerUUID, postBody);
    expect(invoice).to.have.property('invoices');
  });

  it('throws DeprecatedParamError if using old pagination parameter', async () => {
    const customerUuid = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';
    const query = {
      page: 1,
      customer_uuid: customerUuid
    };

    nock(config.API_BASE)
      .get('/v1/contacts')
      .query(query)
      .reply(200, {});

    return await Invoice.all(config, query)
      .catch(e => {
        expect(e).to.be.instanceOf(ChartMogul.DeprecatedParamError);
        expect(e.httpStatus).to.equal(422);
        expect(e.message).to.equal('"page" param is deprecated {}');
      });
  });

  it('should list all customer invoices with pagination', () => {
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

  it('should list all customer invoices in callback', async () => {
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

    const invoice = await Invoice.all(config, customerUUID);
    expect(invoice).to.have.property('invoices');
    expect(invoice.invoices).to.be.instanceof(Array);
    expect(invoice.cursor).to.eql('cursor==');
    expect(invoice.has_more).to.eql(false);
  });
});

describe('Invoices', () => {
  it('should get all invoices', () => {
    nock(config.API_BASE)
      .get('/v1/invoices')
      .reply(200, invoiceListResult);

    return Invoice.all(config)
      .then(res => {
        expect(res).to.have.property('invoices');
        expect(res.invoices).to.be.instanceof(Array);
        expect(res.invoices[0].customer_uuid).to.equal('cus_9bf6482d-01e5-4944-957d-5bc730d2cda3');
        expect(res.cursor).to.eql('cursor==');
        expect(res.has_more).to.eql(false);
      });
  });

  it('should get invoices by external id', async () => {
    nock(config.API_BASE)
      .get('/v1/invoices')
      .query({ external_id: 'INV0001' })
      .reply(200, invoiceListResult);

    const invoice = await Invoice.all(config, { external_id: 'INV0001' });

    expect(invoice).to.have.property('invoices');
    expect(invoice.invoices).to.be.instanceof(Array);
    expect(invoice.invoices[0].external_id).to.equal('INV0001');
    expect(invoice.cursor).to.eql('cursor==');
    expect(invoice.has_more).to.eql(false);
  });

  it('should delete an invoice', () => {
    nock(config.API_BASE)
      .delete('/v1/invoices/inv_cff3a63c-3915-435e-a675-85a8a8ef4454')
      .reply(204, {});

    return Invoice.destroy(config, 'inv_cff3a63c-3915-435e-a675-85a8a8ef4454')
      .then(res => {
        expect(res).to.be.deep.equal({});
      });
  });

  it('should delete all invoices', () => {
    nock(config.API_BASE)
      .delete('/v1/data_sources/ds_cff3a63c-3915-435e-a675-85a8a8ef4454/customers/cus_9bf6482d-01e5-4944-957d-5bc730d2cda3/invoices')
      .reply(204, {});

    return Invoice.destroy_all(config, 'ds_cff3a63c-3915-435e-a675-85a8a8ef4454', 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3')
      .then(res => {
        expect(res).to.be.deep.equal({});
      });
  });

  it('should retrieve an invoice', () => {
    const payload = { external_id: 'some_invoice_id' };
    nock(config.API_BASE)
      .get('/v1/invoices/inv_cff3a63c-3915-435e-a675-85a8a8ef4454')
      .reply(200, payload);

    return Invoice.retrieve(config, 'inv_cff3a63c-3915-435e-a675-85a8a8ef4454')
      .then(res => {
        expect(res).to.be.deep.equal(payload);
      });
  });

  it('should retrieve an invoice with validation_type', () => {
    const payload = { external_id: 'some_invoice_id' };
    nock(config.API_BASE)
      .get('/v1/invoices/inv_cff3a63c-3915-435e-a675-85a8a8ef4454')
      .query({ validation_type: 'all' })
      .reply(200, payload);

    return Invoice.retrieve(config, 'inv_cff3a63c-3915-435e-a675-85a8a8ef4454', { validation_type: 'all' })
      .then(res => {
        expect(res).to.be.deep.equal(payload);
      });
  });

  it('should retrieve an invoice with all params', () => {
    /* eslint-disable camelcase */
    const payload = {
      external_id: 'some_invoice_id',
      disabled: true,
      disabled_at: '2024-01-15T10:30:00.000Z',
      disabled_by: 'user@example.com',
      edit_history_summary: {
        values_changed: {
          currency: {
            original_value: 'EUR',
            edited_value: 'USD'
          },
          date: {
            original_value: '2024-01-01T00:00:00.000Z',
            edited_value: '2024-01-02T00:00:00.000Z'
          }
        },
        latest_edit_author: 'editor@example.com',
        latest_edit_performed_at: '2024-01-20T15:45:00.000Z'
      },
      errors: {
        currency: ['Currency is invalid', 'Currency must be supported'],
        date: ['Date is in the future']
      }
    };
    /* eslint-enable camelcase */

    nock(config.API_BASE)
      .get('/v1/invoices/inv_cff3a63c-3915-435e-a675-85a8a8ef4454')
      .query({
        validation_type: 'invalid',
        include_edit_histories: true,
        with_disabled: false
      })
      .reply(200, payload);

    return Invoice.retrieve(config, 'inv_cff3a63c-3915-435e-a675-85a8a8ef4454', {
      validation_type: 'invalid',
      include_edit_histories: true,
      with_disabled: false
    })
      .then(res => {
        expect(res.disabled).to.equal(true);
        expect(res.disabled_at).to.equal('2024-01-15T10:30:00.000Z');
        expect(res.disabled_by).to.equal('user@example.com');
        expect(res.edit_history_summary).to.be.an('object');
        expect(res.edit_history_summary.values_changed).to.be.an('object');
        expect(res.edit_history_summary.values_changed.currency).to.deep.equal({
          original_value: 'EUR',
          edited_value: 'USD'
        });
        expect(res.edit_history_summary.values_changed.date).to.deep.equal({
          original_value: '2024-01-01T00:00:00.000Z',
          edited_value: '2024-01-02T00:00:00.000Z'
        });
        expect(res.edit_history_summary.latest_edit_author).to.equal('editor@example.com');
        expect(res.edit_history_summary.latest_edit_performed_at).to.equal('2024-01-20T15:45:00.000Z');
        expect(res.errors).to.be.an('object');
        expect(res.errors.currency).to.be.an('array');
        expect(res.errors.currency).to.have.lengthOf(2);
        expect(res.errors.currency[0]).to.equal('Currency is invalid');
        expect(res.errors.currency[1]).to.equal('Currency must be supported');
        expect(res.errors.date).to.be.an('array');
        expect(res.errors.date).to.have.lengthOf(1);
        expect(res.errors.date[0]).to.equal('Date is in the future');
      });
  });

  it('should get invoices with validation_type', async () => {
    nock(config.API_BASE)
      .get('/v1/invoices')
      .query({ validation_type: 'all' })
      .reply(200, invoiceListResult);

    const invoice = await Invoice.all(config, { validation_type: 'all' });

    expect(invoice).to.have.property('invoices');
    expect(invoice.invoices).to.be.instanceof(Array);
    expect(invoice.cursor).to.eql('cursor==');
    expect(invoice.has_more).to.eql(false);
  });

  it('should get invoices with all params', async () => {
    nock(config.API_BASE)
      .get('/v1/invoices')
      .query({
        validation_type: 'valid',
        include_edit_histories: true,
        with_disabled: true
      })
      .reply(200, invoiceListResult);

    const invoice = await Invoice.all(config, {
      validation_type: 'valid',
      include_edit_histories: true,
      with_disabled: true
    });

    expect(invoice).to.have.property('invoices');
    expect(invoice.invoices).to.be.instanceof(Array);
    expect(invoice.cursor).to.eql('cursor==');
    expect(invoice.has_more).to.eql(false);
  });
});
