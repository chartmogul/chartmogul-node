'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const path = require('path');
const fs = require('fs');
const Upload = ChartMogul.Upload;

/* eslint-disable camelcase */
const dsUuid = 'ds_ade45e52-47a4-231a-1ed2-eb6b9e541213';

const uploadResponse = {
  id: 12345,
  status: 'queued',
  created_at: '2026-03-19T10:00:00Z',
  updated_at: '2026-03-19T10:00:00Z',
  error_count: 0,
  processed_count: 0
};
/* eslint-enable camelcase */

describe('Upload', () => {
  it('should upload a CSV file', () => {
    // Create a temporary CSV file for testing
    const tmpFile = path.join(__dirname, 'test-upload.csv');
    fs.writeFileSync(tmpFile, 'name,email\nJohn,john@example.com\n');

    nock(config.API_BASE)
      .post(`/v1/data_sources/${dsUuid}/uploads`)
      .reply(200, uploadResponse);

    return Upload.create(config, dsUuid, {
      file: tmpFile,
      type: 'customers',
      batch_name: 'test_import'
    })
      .then(res => {
        expect(res).to.have.property('id', 12345);
        expect(res.status).to.equal('queued');
      })
      .finally(() => {
        fs.unlinkSync(tmpFile);
      });
  });

  it('should reject with ConfigurationError for invalid config', () => {
    return Upload.create('not-a-config', dsUuid, { file: '/tmp/test.csv', type: 'customers' })
      .then(() => { throw new Error('Expected rejection'); })
      .catch(e => {
        if (e.message === 'Expected rejection') throw e;
        expect(e).to.be.instanceOf(ChartMogul.ConfigurationError);
      });
  });
});
