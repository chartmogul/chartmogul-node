'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token', 'secret');
const expect = require('chai').expect;
const nock = require('nock');
const DataSource = ChartMogul.Import.DataSource;

describe('Data Source', () => {
  it('should create a new data source', () => {
    const postBody = {
      name: 'In-house billing'
    };
    nock(config.API_BASE)
      .post('/v1/import/data_sources', postBody)
      .reply(200, {
        /* eslint-disable camelcase*/
        uuid: 'ds_36a19126-1bc6-4d9e-af36-db06c55f576c',
        name: 'In-house billing',
        created_at: '2016-07-06T08:29:26.602Z',
        status: 'never_imported'
        /* eslint-enable camelcase*/
      });

    return DataSource.create(config, postBody)
    .then(res => {
      expect(res).to.have.property('uuid');
    });
  });

  it('should get all data sources', () => {
    nock(config.API_BASE)
    .get('/v1/import/data_sources')
    .reply(200, {
      /* eslint-disable camelcase*/
      data_sources: [{
        uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
        name: 'In-house billing',
        created_at: '2016-07-05T16:37:30.750Z',
        status: 'import_complete'
      }]
      /* eslint-enable camelcase*/
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
    .delete('/v1/import/data_sources' + '/' + uuid)
    .reply(204);

    return DataSource.destroy(config, uuid);
  });
});
