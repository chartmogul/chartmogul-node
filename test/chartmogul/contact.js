'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const Contact = ChartMogul.Contact;

describe('Contact', () => {
  it('creates a new contact', () => {
    const postBody = {
      /* eslint-disable camelcase */
      customer_uuid: 'cus_919d5d7c-9e23-11ed-a936-97fbf69ba02b',
      data_source_uuid: 'ds_87832fac-ab61-11ec-a8d8-6fb18044a151',
      data_source_customer_external_id: 'scus_606e14228cff7d9db01be55f4e32e5e4',
      first_name: 'First name',
      last_name: 'Last name',
      position: 9,
      title: 'Title',
      email: 'test@example.com',
      phone: '+1234567890',
      linked_in: 'https://linkedin.com/not_found',
      twitter: 'https://twitter.com/not_found',
      notes: 'Heading\nBody\nFooter',
      custom: [
        { key: 'Booleanz', value: false },
        { key: 'MyIntegerAttribute', value: 123 }
      ]
      /* eslint-enable camelcase */
    };

    nock(config.API_BASE)
      .post('/v1/contacts', postBody)
      .reply(200, {
        /* eslint-disable camelcase */
        uuid: 'con_00000000-0000-0000-0000-000000000000',
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        data_source_uuid: 'ds_00000000-0000-0000-0000-000000000000',
        data_source_customer_external_id: 'external_001',
        first_name: 'First name',
        last_name: 'Last name',
        position: 9,
        title: 'Title',
        email: 'test@example.com',
        phone: '+1234567890',
        linked_in: 'https://linkedin.com/not_found',
        twitter: 'https://twitter.com/not_found',
        notes: 'Heading\nBody\nFooter',
        custom: {
          MyStringAttribute: 'Test',
          MyIntegerAttribute: 123
        }
        /* eslint-enable camelcase */
      });

    Contact.create(config, postBody)
      .then(res => {
        expect(res).to.have.property('uuid');
      });
  });

  it('gets all contacts', () => {
    nock(config.API_BASE)
      .get('/v1/contacts')
      .reply(200, {
      /* eslint-disable camelcase */
        entries: [{
          uuid: 'con_00000000-0000-0000-0000-000000000000',
          customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
          data_source_uuid: 'ds_00000000-0000-0000-0000-000000000000',
          customer_external_id: 'external_001',
          email: 'test@example.com'
        }],
        cursor: 'MjAyMy0wMy0xM1QxMjowMTozMi44MD==',
        has_more: false
      /* eslint-enable camelcase */
      });

    return Contact.all(config)
      .then(res => {
        expect(res).to.have.property('entries');
        expect(res.entries).to.be.instanceof(Array);
        expect(res.cursor).to.eql('MjAyMy0wMy0xM1QxMjowMTozMi44MD==');
        expect(res.has_more).to.eql(false);
      });
  });

  it('retrieves a contact', () => {
    const contactUuid = 'con_00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE)
      .get(`/v1/contacts/${contactUuid}`)
      .reply(200, {
        /* eslint-disable camelcase */
        uuid: 'con_00000000-0000-0000-0000-000000000000',
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        data_source_uuid: 'ds_00000000-0000-0000-0000-000000000000',
        customer_external_id: 'external_001',
        first_name: 'First name',
        last_name: 'Last name',
        position: 9,
        title: 'Title',
        email: 'test@example.com',
        phone: '+1234567890',
        linked_in: 'https://linkedin.com/not_found',
        twitter: 'https://twitter.com/not_found',
        notes: 'Heading\nBody\nFooter',
        custom: {
          MyStringAttribute: 'Test',
          MyIntegerAttribute: 123
        }
        /* eslint-enable camelcase */
      });

    return Contact.retrieve(config, contactUuid)
      .then(res => {
        expect(res).to.have.property('uuid');
      });
  });

  it('updates a contact', () => {
    const contactUuid = 'con_00000000-0000-0000-0000-000000000000';

    /* eslint-disable camelcase */
    const postBody = { email: 'test2@example.com' };
    /* eslint-enable camelcase */

    nock(config.API_BASE)
      .patch(`/v1/contacts/${contactUuid}`, postBody)
      .reply(200, {
        /* eslint-disable camelcase */
        uuid: contactUuid,
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        data_source_uuid: 'ds_00000000-0000-0000-0000-000000000000',
        customer_external_id: 'external_001',
        email: 'test2@example.com'
        /* eslint-enable camelcase */
      });

    return Contact.modify(config, contactUuid, postBody)
      .then(res => {
        expect(res.email).to.be.equal('test2@example.com');
      });
  });

  it('deletes a contact', () => {
    const uuid = 'con_00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE)
      .delete('/v1/contacts' + '/' + uuid)
      .reply(204);

    return Contact.destroy(config, uuid);
  });

  it('merges contacts', () => {
    const intoUuid = 'con_00000000-0000-0000-0000-000000000000';
    const fromUuid = 'con_00000000-0000-0000-0000-000000000001';

    nock(config.API_BASE)
      .post(`/v1/contacts/${intoUuid}/merge/${fromUuid}`)
      .reply(200, {});

    return Contact.merge(config, intoUuid, fromUuid)
      .then(res => {
        expect(200);
        expect(res).to.be.instanceof(Object);
      });
  });
});
