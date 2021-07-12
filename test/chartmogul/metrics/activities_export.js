'use strict';

const ChartMogul = require('../../../lib/chartmogul');
const config = new ChartMogul.Config('token', 'secret');
const expect = require('chai').expect;
const nock = require('nock');
const ActivitiesExport = ChartMogul.Metrics.ActivitiesExport;

describe('ActivitiesExport', () => {
  it('should create an activities export', () => {
    const pendingExport = {
      id: '7f554dba-4a41-4cb2-9790-2045e4c3a5b1',
      status: 'pending',
      file_url: null,
      params: {
        kind: 'activities',
        params: {
          activity_type: 'contraction',
          start_date: '2020-01-01',
          end_date: '2020-12-31'
        }
      },
      expires_at: null,
      created_at: '2021-07-12T14:46:56+00:00'
    };

    const query = {
      'start-date': '2020-01-01',
      'end-date': '2020-12-31',
      type: 'contraction'
    };

    nock(config.API_BASE)
      .post('/v1/activities_export')
      .reply(200, pendingExport);

    return ActivitiesExport.create(config, query)
      .then(res => {
        expect(res).to.be.deep.equal(pendingExport);
      });
  });

  it('should retrieve a successful activities export after a period of time', () => {
    const succeededExport = {
      id: '7f554dba-4a41-4cb2-9790-2045e4c3a5b1',
      status: 'succeeded',
      file_url: 'https://chartmogul-customer-export.s3.eu-west-1.amazonaws.com/activities-acme-corp-91e1ca88-d747-4e25-83d9-2b752033bdba.zip',
      params: {
        kind: 'activities',
        params: {
          activity_type: 'contraction',
          start_date: '2020-01-01',
          end_date: '2020-12-31'
        }
      },
      expires_at: '2021-07-19T14:46:58+00:00',
      created_at: '2021-07-12T14:46:56+00:00'
    };
    nock(config.API_BASE)
      .get('/v1/activities_export/7f554dba-4a41-4cb2-9790-2045e4c3a5b1')
      .reply(200, succeededExport);

    return ActivitiesExport.retrieve(config, '7f554dba-4a41-4cb2-9790-2045e4c3a5b1')
      .then(res => {
        expect(res).to.be.deep.equal(succeededExport);
      });
  });
});
