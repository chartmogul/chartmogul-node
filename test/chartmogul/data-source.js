'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const DataSource = ChartMogul.DataSource;

describe('Data Source', () => {
  it('should create a new data source', () => {
    const postBody = {
      name: 'In-house billing'
    };
    nock(config.API_BASE)
      .post('/v1/data_sources', postBody)
      .reply(200, {
        /* eslint-disable camelcase */
        uuid: 'ds_36a19126-1bc6-4d9e-af36-db06c55f576c',
        name: 'In-house billing',
        created_at: '2016-07-06T08:29:26.602Z',
        status: 'never_imported'
        /* eslint-enable camelcase */
      });

    return DataSource.create(config, postBody)
      .then(res => {
        expect(res).to.have.property('uuid');
      });
  });

  it('should get all data sources', () => {
    nock(config.API_BASE)
      .get('/v1/data_sources')
      .reply(200, {
      /* eslint-disable camelcase */
        data_sources: [{
          uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
          name: 'In-house billing',
          created_at: '2016-07-05T16:37:30.750Z',
          status: 'import_complete'
        }]
      /* eslint-enable camelcase */
      });

    return DataSource.all(config)
      .then(res => {
        expect(res).to.have.property('data_sources');
        expect(res.data_sources).to.be.instanceof(Array);
      });
  });

  it('should delete a data source', () => {
    const uuid = 'ds_6f8de69c-56e3-4cb3-83ad-17e6715d03fb';

    nock(config.API_BASE)
      .delete('/v1/data_sources' + '/' + uuid)
      .reply(204);

    return DataSource.destroy(config, uuid);
  });

  it('should get all data sources with optional processing status parameter', () => {
    const query = {
      with_processing_status: true
    };

    nock(config.API_BASE)
      .get('/v1/data_sources')
      .query(query)
      .reply(200, {
      /* eslint-disable camelcase */
        data_sources: [{
          uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
          name: 'In-house billing',
          created_at: '2016-07-05T16:37:30.750Z',
          status: 'import_complete',
          processing_status: {
            processed: 21,
            pending: 7,
            failed: 12
          }
        }]
      /* eslint-enable camelcase */
      });

    return DataSource.all(config, query)
      .then(res => {
        expect(res).to.have.property('data_sources');
        expect(res.data_sources).to.be.instanceof(Array);
        expect(res.data_sources[0]).to.have.property('processing_status');
      });
  });

  it('should get all data sources with optional auto churn subscription setting parameter', () => {
    const query = {
      with_auto_churn_subscription_setting: true
    };

    nock(config.API_BASE)
      .get('/v1/data_sources')
      .query(query)
      .reply(200, {
      /* eslint-disable camelcase */
        data_sources: [{
          uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
          name: 'In-house billing',
          created_at: '2016-07-05T16:37:30.750Z',
          status: 'import_complete',
          auto_churn_subscription_setting: 'enabled'
        }]
      /* eslint-enable camelcase */
      });

    return DataSource.all(config, query)
      .then(res => {
        expect(res).to.have.property('data_sources');
        expect(res.data_sources).to.be.instanceof(Array);
        expect(res.data_sources[0]).to.have.property('auto_churn_subscription_setting');
      });
  });

  it('should get all data sources with optional invoice handling setting parameter', () => {
    const query = {
      with_invoice_handling_setting: true
    };

    nock(config.API_BASE)
      .get('/v1/data_sources')
      .query(query)
      .reply(200, {
      /* eslint-disable camelcase */
        data_sources: [{
          uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
          name: 'In-house billing',
          created_at: '2016-07-05T16:37:30.750Z',
          status: 'import_complete',
          invoice_handling_setting: {
            manual: {
              create_subscription_when_invoice_is: 'open',
              update_subscription_when_invoice_is: 'open',
              prevent_subscription_for_invoice_voided: true,
              prevent_subscription_for_invoice_refunded: false,
              prevent_subscription_for_invoice_written_off: true
            },
            automatic: {
              create_subscription_when_invoice_is: 'paid',
              update_subscription_when_invoice_is: 'open',
              prevent_subscription_for_invoice_voided: true,
              prevent_subscription_for_invoice_refunded: false,
              prevent_subscription_for_invoice_written_off: true
            }
          }
        }]
      /* eslint-enable camelcase */
      });

    return DataSource.all(config, query)
      .then(res => {
        expect(res).to.have.property('data_sources');
        expect(res.data_sources).to.be.instanceof(Array);
        expect(res.data_sources[0]).to.have.property('invoice_handling_setting');
      });
  });

  it('should get all data sources with multiple optional parameters', () => {
    const query = {
      with_processing_status: true,
      with_auto_churn_subscription_setting: true,
      with_invoice_handling_setting: true
    };

    nock(config.API_BASE)
      .get('/v1/data_sources')
      .query(query)
      .reply(200, {
      /* eslint-disable camelcase */
        data_sources: [{
          uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
          name: 'In-house billing',
          created_at: '2016-07-05T16:37:30.750Z',
          status: 'import_complete',
          processing_status: {
            processed: 21,
            pending: 7,
            failed: 12
          },
          auto_churn_subscription_setting: {
            enabled: true,
            interval: 14
          },
          invoice_handling_setting: {
            manual: {
              create_subscription_when_invoice_is: 'open',
              update_subscription_when_invoice_is: 'open',
              prevent_subscription_for_invoice_voided: true,
              prevent_subscription_for_invoice_refunded: false,
              prevent_subscription_for_invoice_written_off: true
            },
            automatic: {
              create_subscription_when_invoice_is: 'paid',
              update_subscription_when_invoice_is: 'open',
              prevent_subscription_for_invoice_voided: true,
              prevent_subscription_for_invoice_refunded: false,
              prevent_subscription_for_invoice_written_off: true
            }
          }
        }]
      /* eslint-enable camelcase */
      });

    return DataSource.all(config, query)
      .then(res => {
        expect(res).to.have.property('data_sources');
        expect(res.data_sources).to.be.instanceof(Array);
        expect(res.data_sources[0]).to.have.property('processing_status');
        expect(res.data_sources[0]).to.have.property('auto_churn_subscription_setting');
        expect(res.data_sources[0]).to.have.property('invoice_handling_setting');
      });
  });

  it('should get all data sources filtered by name', () => {
    const query = {
      name: 'Stripe'
    };

    nock(config.API_BASE)
      .get('/v1/data_sources')
      .query(query)
      .reply(200, {
      /* eslint-disable camelcase */
        data_sources: [{
          uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
          name: 'Stripe',
          created_at: '2016-07-05T16:37:30.750Z',
          status: 'import_complete'
        }]
      /* eslint-enable camelcase */
      });

    return DataSource.all(config, query)
      .then(res => {
        expect(res).to.have.property('data_sources');
        expect(res.data_sources).to.be.instanceof(Array);
        expect(res.data_sources[0]).to.have.property('name', 'Stripe');
      });
  });

  it('should get all data sources filtered by system', () => {
    const query = {
      system: 'stripe'
    };

    nock(config.API_BASE)
      .get('/v1/data_sources')
      .query(query)
      .reply(200, {
      /* eslint-disable camelcase */
        data_sources: [{
          uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
          name: 'Stripe Data Source',
          system: 'stripe',
          created_at: '2016-07-05T16:37:30.750Z',
          status: 'import_complete'
        }]
      /* eslint-enable camelcase */
      });

    return DataSource.all(config, query)
      .then(res => {
        expect(res).to.have.property('data_sources');
        expect(res.data_sources).to.be.instanceof(Array);
        expect(res.data_sources[0]).to.have.property('system', 'stripe');
      });
  });

  it('should get all data sources with filtering and optional parameters combined', () => {
    const query = {
      name: 'Stripe',
      system: 'stripe',
      with_processing_status: true,
      with_auto_churn_subscription_setting: true,
      with_invoice_handling_setting: true
    };

    nock(config.API_BASE)
      .get('/v1/data_sources')
      .query(query)
      .reply(200, {
      /* eslint-disable camelcase */
        data_sources: [{
          uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
          name: 'Stripe',
          system: 'stripe',
          created_at: '2016-07-05T16:37:30.750Z',
          status: 'import_complete',
          processing_status: {
            processed: 21,
            pending: 7,
            failed: 12
          },
          auto_churn_subscription_setting: {
            enabled: true,
            interval: 14
          },
          invoice_handling_setting: {
            manual: {
              create_subscription_when_invoice_is: 'open',
              update_subscription_when_invoice_is: 'open',
              prevent_subscription_for_invoice_voided: true,
              prevent_subscription_for_invoice_refunded: false,
              prevent_subscription_for_invoice_written_off: true
            },
            automatic: {
              create_subscription_when_invoice_is: 'paid',
              update_subscription_when_invoice_is: 'open',
              prevent_subscription_for_invoice_voided: true,
              prevent_subscription_for_invoice_refunded: false,
              prevent_subscription_for_invoice_written_off: true
            }
          }
        }]
      /* eslint-enable camelcase */
      });

    return DataSource.all(config, query)
      .then(res => {
        expect(res).to.have.property('data_sources');
        expect(res.data_sources).to.be.instanceof(Array);
        expect(res.data_sources[0]).to.have.property('name', 'Stripe');
        expect(res.data_sources[0]).to.have.property('system', 'stripe');
        expect(res.data_sources[0]).to.have.property('processing_status');
        expect(res.data_sources[0]).to.have.property('auto_churn_subscription_setting');
        expect(res.data_sources[0]).to.have.property('invoice_handling_setting');
      });
  });

  it('should retrieve a data source with optional processing status parameter', () => {
    const uuid = 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1';
    const query = {
      with_processing_status: true
    };

    nock(config.API_BASE)
      .get('/v1/data_sources/' + uuid)
      .query(query)
      .reply(200, {
      /* eslint-disable camelcase */
        uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
        name: 'In-house billing',
        created_at: '2016-07-05T16:37:30.750Z',
        status: 'import_complete',
        processing_status: {
          processed: 21,
          pending: 7,
          failed: 12
        }
      /* eslint-enable camelcase */
      });

    return DataSource.retrieve(config, uuid, query)
      .then(res => {
        expect(res).to.have.property('uuid');
        expect(res).to.have.property('processing_status');
      });
  });

  it('should retrieve a data source with optional auto churn subscription setting parameter', () => {
    const uuid = 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1';
    const query = {
      with_auto_churn_subscription_setting: true
    };

    nock(config.API_BASE)
      .get('/v1/data_sources/' + uuid)
      .query(query)
      .reply(200, {
      /* eslint-disable camelcase */
        uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
        name: 'In-house billing',
        created_at: '2016-07-05T16:37:30.750Z',
        status: 'import_complete',
        auto_churn_subscription_setting: 'enabled'
      /* eslint-enable camelcase */
      });

    return DataSource.retrieve(config, uuid, query)
      .then(res => {
        expect(res).to.have.property('uuid');
        expect(res).to.have.property('auto_churn_subscription_setting');
      });
  });

  it('should retrieve a data source with optional invoice handling setting parameter', () => {
    const uuid = 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1';
    const query = {
      with_invoice_handling_setting: true
    };

    nock(config.API_BASE)
      .get('/v1/data_sources/' + uuid)
      .query(query)
      .reply(200, {
      /* eslint-disable camelcase */
        uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
        name: 'In-house billing',
        created_at: '2016-07-05T16:37:30.750Z',
        status: 'import_complete',
        invoice_handling_setting: {
          manual: {
            create_subscription_when_invoice_is: 'open',
            update_subscription_when_invoice_is: 'open',
            prevent_subscription_for_invoice_voided: true,
            prevent_subscription_for_invoice_refunded: false,
            prevent_subscription_for_invoice_written_off: true
          },
          automatic: {
            create_subscription_when_invoice_is: 'paid',
            update_subscription_when_invoice_is: 'open',
            prevent_subscription_for_invoice_voided: true,
            prevent_subscription_for_invoice_refunded: false,
            prevent_subscription_for_invoice_written_off: true
          }
        }
      /* eslint-enable camelcase */
      });

    return DataSource.retrieve(config, uuid, query)
      .then(res => {
        expect(res).to.have.property('uuid');
        expect(res).to.have.property('invoice_handling_setting');
      });
  });

  it('should retrieve a data source with multiple optional parameters', () => {
    const uuid = 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1';
    const query = {
      with_processing_status: true,
      with_auto_churn_subscription_setting: true,
      with_invoice_handling_setting: true
    };

    nock(config.API_BASE)
      .get('/v1/data_sources/' + uuid)
      .query(query)
      .reply(200, {
      /* eslint-disable camelcase */
        uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
        name: 'In-house billing',
        created_at: '2016-07-05T16:37:30.750Z',
        status: 'import_complete',
        processing_status: {
          processed: 21,
          pending: 7,
          failed: 12
        },
        auto_churn_subscription_setting: {
          enabled: true,
          interval: 14
        },
        invoice_handling_setting: {
          manual: {
            create_subscription_when_invoice_is: 'open',
            update_subscription_when_invoice_is: 'open',
            prevent_subscription_for_invoice_voided: true,
            prevent_subscription_for_invoice_refunded: false,
            prevent_subscription_for_invoice_written_off: true
          },
          automatic: {
            create_subscription_when_invoice_is: 'paid',
            update_subscription_when_invoice_is: 'open',
            prevent_subscription_for_invoice_voided: true,
            prevent_subscription_for_invoice_refunded: false,
            prevent_subscription_for_invoice_written_off: true
          }
        }
      /* eslint-enable camelcase */
      });

    return DataSource.retrieve(config, uuid, query)
      .then(res => {
        expect(res).to.have.property('uuid');
        expect(res).to.have.property('processing_status');
        expect(res).to.have.property('auto_churn_subscription_setting');
        expect(res).to.have.property('invoice_handling_setting');
      });
  });
});
