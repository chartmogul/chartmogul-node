'use strict';

const ChartMogul = require('../../../lib/chartmogul');
const config = new ChartMogul.Config('token', 'secret');
const expect = require('chai').expect;
const nock = require('nock');
const CustomAttribute = ChartMogul.Enrichment.CustomAttribute;

describe('CustomAttribute', () => {
  it('should add custom attributes to a customer', () => {
    const customerUuid = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';
    const postBody = {
      'custom': [
        {'type': 'String', 'key': 'channel', 'value': 'Facebook'},
        {'type': 'Integer', 'key': 'age', 'value': 8}
      ]
    };

    nock(config.API_BASE)
      .post(`/v1/customers/${customerUuid}/attributes/custom`, postBody)
      .reply(200, {
        /* eslint-disable camelcase */
        custom: { channel: 'Facebook', age: 8 }
        /* eslint-enable camelcase */
      });

    return CustomAttribute.add(config, customerUuid, postBody)
    .then(res => {
      expect(res).to.have.property('custom');
    });
  });

  it('should add custom attributes to customers with email', () => {
    const postBody = {
      'email': 'adam@smith.com',
      'custom': [
        {'type': 'Integer', 'key': 'CAC', 'value': 213}
      ]
    };

    nock(config.API_BASE)
      .post('/v1/customers/attributes/custom', postBody)
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
                'bar'
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

    return CustomAttribute.add(config, postBody)
    .then(res => {
      expect(res).to.have.property('entries');
    });
  });

  it('should update custom attributes of a customer', () => {
    const customerUuid = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';
    const postBody = {
      'custom': {
        'age': 20,
        'channel': 'Twitter'
      }
    };

    nock(config.API_BASE)
    .put(`/v1/customers/${customerUuid}/attributes/custom`, postBody)
    .reply(200, {
      /* eslint-disable camelcase */
      custom: { channel: 'Twitter', age: '20', CAC: 213 }
      /* eslint-enable camelcase */
    });

    return CustomAttribute.update(config, customerUuid, postBody)
    .then(res => {
      expect(res).to.have.property('custom');
      expect(res.custom).to.have.property('age', '20');
    });
  });

  it('should remove custom attributes from a customer', () => {
    const customerUuid = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';
    const postBody = {
      'custom': ['CAC']
    };

    nock(config.API_BASE)
    .delete(`/v1/customers/${customerUuid}/attributes/custom`, postBody)
    .reply(200, {
      /* eslint-disable camelcase */
      custom: { channel: 'Twitter', age: '20' }
      /* eslint-enable camelcase */
    });

    return CustomAttribute.remove(config, customerUuid, postBody)
    .then(res => {
      expect(res).to.have.property('custom');
      expect(res.custom).to.not.have.property('CAC');
    });
  });
});
