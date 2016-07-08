'use strict';

const ChartMogul = require('../../../lib/chartmogul');
const config = new ChartMogul.Config('token', 'secret');
const expect = require('chai').expect;
const nock = require('nock');
const Tag = ChartMogul.Enrichment.Tag;

describe('Tag', () => {
  it('should add tags to a customer', () => {
    const customerUuid = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';
    const postBody = {
      'tags': ['important', 'Prio1']
    };

    nock(config.API_BASE)
      .post(`/v1/customers/${customerUuid}/attributes/tags`, postBody)
      .reply(200, {
        /* eslint-disable camelcase */
        tags: [ 'important', 'Prio1' ]
        /* eslint-enable camelcase */
      });

    return Tag.add(config, customerUuid, postBody)
    .then(res => {
      expect(res).to.have.property('tags');
    });
  });

  it('should add tags to customers with email', () => {
    const postBody = {
      'email': 'adam@smith.com',
      'tags': [ 'engage', 'unit loss' ]
    };

    nock(config.API_BASE)
      .post('/v1/customers/attributes/tags', postBody)
      .reply(200, {
        /* eslint-disable camelcase */
        'entries': [
          {
            'id': 244461,
            'uuid': 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3',
            'external_id': 'cus_0002',
            'name': 'Adam Smith',
            'email': 'adam@smith.com',
            'status': 'Cancelled',
            'customer-since': '2015-11-01T00:00:00+00:00',
            'attributes': {
              'tags': [
                'foo',
                'bar',
                'engage',
                'unit loss'
              ],
              'custom': {
                'channel': 'Facebook',
                'age': 8,
                'CAC': 213
              }
            }
          }
        ]
        /* eslint-enable camelcase */
      });

    return Tag.add(config, postBody)
    .then(res => {
      expect(res).to.have.property('entries');
    });
  });

  it('should remove tags from a customer', () => {
    const customerUuid = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';
    const postBody = {
      'tags': ['Prio1']
    };

    nock(config.API_BASE)
    .delete(`/v1/customers/${customerUuid}/attributes/tags`, postBody)
    .reply(200, {
      /* eslint-disable camelcase */
      tags: [ 'foo', 'bar', 'important', 'engage', 'unit loss' ]
      /* eslint-enable camelcase */
    });

    return Tag.remove(config, customerUuid, postBody)
    .then(res => {
      expect(res).to.have.property('tags');
      expect(res.tags).to.not.have.property('Prio1');
    });
  });
});
