'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const JsonImport = ChartMogul.JsonImport;

/* eslint-disable camelcase */
const dsUuid = 'ds_1fm3eaac-62d0-31ec-clf4-4bf0mbe81aba';

const importBody = {
  external_id: 'ds_import_1',
  customers: [
    {
      external_id: 'scus_0001',
      name: 'Andrew Jones',
      email: 'andrew@example.com'
    }
  ],
  plans: [
    {
      name: 'Gold Biannual',
      external_id: 'gold_biannual',
      interval_count: 6,
      interval_unit: 'month'
    }
  ]
};

const importResponse = {
  id: '4815d987-1234-11ee-a987-978df45c5114',
  data_source_uuid: dsUuid,
  status: 'queued',
  external_id: 'ds_import_1',
  status_details: {},
  created_at: '2023-06-01T23:55:23Z',
  updated_at: '2023-06-01T23:55:23Z'
};

const trackResponse = {
  id: '4815d987-1234-11ee-a987-978df45c5114',
  data_source_uuid: dsUuid,
  status: 'completed',
  external_id: 'ds_import_1',
  status_details: {
    plans: { status: 'imported' },
    scus_0001: { status: 'imported' }
  },
  created_at: '2023-06-01T23:55:23Z',
  updated_at: '2023-06-01T23:56:00Z'
};
/* eslint-enable camelcase */

describe('JsonImport', () => {
  it('should create a bulk import', () => {
    nock(config.API_BASE)
      .post(`/v1/data_sources/${dsUuid}/json_imports`)
      .reply(200, importResponse);

    return JsonImport.create(config, dsUuid, importBody)
      .then(res => {
        expect(res).to.have.property('id');
        expect(res.status).to.equal('queued');
        expect(res.external_id).to.equal('ds_import_1');
      });
  });

  it('should track import status', () => {
    const importId = 'ds_import_1';

    nock(config.API_BASE)
      .get(`/v1/data_sources/${dsUuid}/json_imports/${importId}`)
      .reply(200, trackResponse);

    return JsonImport.retrieve(config, dsUuid, importId)
      .then(res => {
        expect(res).to.have.property('id');
        expect(res.status).to.equal('completed');
        expect(res.status_details).to.be.an('object');
      });
  });
});
