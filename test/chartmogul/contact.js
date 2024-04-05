'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const Contact = ChartMogul.Contact;

describe('Contact', () => {
  it('creates a new contact', async () => {
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

    const contact = await Contact.create(config, postBody);
    expect(contact).to.have.property('uuid');
  });

  it('should list all contacts with pagination', async () => {
    const query = {
      per_page: 1,
      cursor: 'cursor=='
    };

    nock(config.API_BASE)
      .get('/v1/contacts')
      .query(query)
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

    const contact = await Contact.all(config, query);
    expect(contact).to.have.property('entries');
    expect(contact).to.have.property('cursor');
    expect(contact).to.have.property('has_more');
    expect(contact.entries).to.be.instanceof(Array);
    expect(contact.cursor).to.eql('MjAyMy0wMy0xM1QxMjowMTozMi44MD==');
    expect(contact.has_more).to.eql(false);
  });

  it('throws DeprecatedParamError if using old pagination parameter', async () => {
    const query = { page: 1 };

    nock(config.API_BASE)
      .get('/v1/contacts')
      .query(query)
      .reply(200, {});

    await Contact.all(config, query)
      .catch(e => {
        expect(e).to.be.instanceOf(ChartMogul.DeprecatedParamError);
        expect(e.message).to.equal('"page" param is deprecated {}');
        expect(e.httpStatus).to.equal(422);
        // eslint-disable-next-line no-unused-expressions
        expect(e.response).to.empty;
      });
  });

  it('retrieves a contact', async () => {
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

    const contact = await Contact.retrieve(config, contactUuid);
    expect(contact).to.have.property('uuid');
  });

  it('updates a contact', async () => {
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

    const contact = await Contact.modify(config, contactUuid, postBody);
    expect(contact.email).to.be.equal('test2@example.com');
  });

  it('deletes a contact', async () => {
    const uuid = 'con_00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE)
      .delete('/v1/contacts' + '/' + uuid)
      .reply(204);

    const contact = await Contact.destroy(config, uuid);
    // eslint-disable-next-line no-unused-expressions
    expect(contact).to.be.empty;
  });

  it('merges contacts', async () => {
    const intoUuid = 'con_00000000-0000-0000-0000-000000000000';
    const fromUuid = 'con_00000000-0000-0000-0000-000000000001';

    nock(config.API_BASE)
      .post(`/v1/contacts/${intoUuid}/merge/${fromUuid}`)
      .reply(200, {});

    const result = await Contact.merge(config, intoUuid, fromUuid);
    // eslint-disable-next-line no-unused-expressions
    expect(result).to.empty;
    expect(result).to.be.instanceof(Object);
  });
});
