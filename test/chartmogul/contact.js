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
      external_id: 'contact_external_id_001',
      first_name: 'First name',
      last_name: 'Last name',
      position: 9,
      title: 'Title',
      email: 'test@example.com',
      phone: '+1234567890',
      linked_in: 'https://linkedin.com/not_found',
      twitter: 'https://twitter.com/not_found',
      notes: 'Heading\nBody\nFooter',
      last_seen: '2024-06-15T10:30:00Z',
      custom: [
        { key: 'Booleanz', value: false },
        { key: 'MyIntegerAttribute', value: 123 }
      ]
      /* eslint-enable camelcase */
    };

    nock(config.API_BASE)
      .post('/v1/contacts', postBody)
      .reply(201, {
        /* eslint-disable camelcase */
        uuid: 'con_00000000-0000-0000-0000-000000000000',
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        customer_external_id: 'external_001',
        data_source_uuid: 'ds_00000000-0000-0000-0000-000000000000',
        position: 9,
        external_id: 'contact_external_id_001',
        first_name: 'First name',
        last_name: 'Last name',
        title: 'Title',
        email: 'test@example.com',
        phone: '+1234567890',
        linked_in: 'https://linkedin.com/not_found',
        twitter: 'https://twitter.com/not_found',
        notes: 'Heading\nBody\nFooter',
        last_seen: '2024-06-15T10:30:00.000Z',
        custom: {
          MyStringAttribute: 'Test',
          MyIntegerAttribute: 123
        }
        /* eslint-enable camelcase */
      });

    const contact = await Contact.create(config, postBody);
    expect(contact).to.have.property('uuid');
    expect(contact.customer_external_id).to.equal('external_001');
    expect(contact.last_seen).to.equal('2024-06-15T10:30:00.000Z');
  });

  it('creates a standalone contact without customer or data source', async () => {
    const postBody = {
      /* eslint-disable camelcase */
      first_name: 'First name',
      last_name: 'Last name',
      email: 'test@example.com'
      /* eslint-enable camelcase */
    };

    nock(config.API_BASE)
      .post('/v1/contacts', postBody)
      .reply(201, {
        /* eslint-disable camelcase */
        uuid: 'con_11111111-1111-1111-1111-111111111111',
        customer_uuid: null,
        customer_external_id: null,
        data_source_uuid: null,
        position: null,
        external_id: null,
        first_name: 'First name',
        last_name: 'Last name',
        title: null,
        email: 'test@example.com',
        phone: null,
        linked_in: null,
        twitter: null,
        notes: null,
        last_seen: null,
        custom: {}
        /* eslint-enable camelcase */
      });

    const contact = await Contact.create(config, postBody);
    expect(contact.uuid).to.equal('con_11111111-1111-1111-1111-111111111111');
    /* eslint-disable no-unused-expressions */
    expect(contact.customer_uuid).to.be.null;
    expect(contact.customer_external_id).to.be.null;
    expect(contact.data_source_uuid).to.be.null;
    expect(contact.last_seen).to.be.null;
    /* eslint-enable no-unused-expressions */
  });

  it('creates a new contact with external_id as null', async () => {
    const postBody = {
      /* eslint-disable camelcase */
      customer_uuid: 'cus_919d5d7c-9e23-11ed-a936-97fbf69ba02b',
      data_source_uuid: 'ds_87832fac-ab61-11ec-a8d8-6fb18044a151',
      external_id: null,
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

    let requestBody;
    nock(config.API_BASE)
      .post('/v1/contacts', body => { requestBody = body; return true; })
      .reply(200, { uuid: 'con_00000000-0000-0000-0000-000000000000' });

    await Contact.create(config, postBody);
    // eslint-disable-next-line no-unused-expressions
    expect(requestBody).to.have.property('external_id').that.is.null;
  });

  it('creates a new contact without external_id', async () => {
    const postBody = {
      /* eslint-disable camelcase */
      customer_uuid: 'cus_919d5d7c-9e23-11ed-a936-97fbf69ba02b',
      data_source_uuid: 'ds_87832fac-ab61-11ec-a8d8-6fb18044a151',
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

    let requestBody;
    nock(config.API_BASE)
      .post('/v1/contacts', body => { requestBody = body; return true; })
      .reply(200, { uuid: 'con_00000000-0000-0000-0000-000000000000' });

    await Contact.create(config, postBody);
    expect(requestBody).to.not.have.property('external_id');
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

  it('lists contacts filtered by customer, data source, email and external ids', async () => {
    const query = {
      /* eslint-disable camelcase */
      customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
      data_source_uuid: 'ds_00000000-0000-0000-0000-000000000000',
      email: 'test@example.com',
      customer_external_id: 'external_001',
      external_id: 'contact_external_id_001',
      per_page: 10
      /* eslint-enable camelcase */
    };

    nock(config.API_BASE)
      .get('/v1/contacts')
      .query(query)
      .reply(200, {
        /* eslint-disable camelcase */
        entries: [{
          uuid: 'con_00000000-0000-0000-0000-000000000000',
          customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
          customer_external_id: 'external_001',
          data_source_uuid: 'ds_00000000-0000-0000-0000-000000000000',
          external_id: 'contact_external_id_001',
          email: 'test@example.com',
          last_seen: '2024-06-15T10:30:00.000Z'
        }],
        cursor: 'MjAyMy0wMy0xM1QxMjowMTozMi44MD==',
        has_more: false
        /* eslint-enable camelcase */
      });

    const contacts = await Contact.all(config, query);
    expect(contacts.entries).to.have.lengthOf(1);
    expect(contacts.entries[0].external_id).to.equal('contact_external_id_001');
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
        external_id: 'contact_external_id_001',
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
    const patchBody = { email: 'test2@example.com', external_id: 'contact_external_id_002' };
    /* eslint-enable camelcase */

    nock(config.API_BASE)
      .patch(`/v1/contacts/${contactUuid}`, patchBody)
      .reply(200, {
        /* eslint-disable camelcase */
        uuid: contactUuid,
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        data_source_uuid: 'ds_00000000-0000-0000-0000-000000000000',
        customer_external_id: 'external_001',
        email: 'test2@example.com',
        external_id: 'contact_external_id_002'
        /* eslint-enable camelcase */
      });

    const contact = await Contact.modify(config, contactUuid, patchBody);
    expect(contact.email).to.be.equal('test2@example.com');
    expect(contact.external_id).to.be.equal('contact_external_id_002');
  });

  it('updates a contact with external_id as null', async () => {
    const contactUuid = 'con_00000000-0000-0000-0000-000000000000';

    /* eslint-disable camelcase */
    const patchBody = { external_id: null };
    /* eslint-enable camelcase */

    let requestBody;
    nock(config.API_BASE)
      .patch(`/v1/contacts/${contactUuid}`, body => { requestBody = body; return true; })
      .reply(200, { uuid: contactUuid });

    await Contact.modify(config, contactUuid, patchBody);
    // eslint-disable-next-line no-unused-expressions
    expect(requestBody).to.have.property('external_id').that.is.null;
  });

  it('updates a contact with last_seen and customer_external_id', async () => {
    const contactUuid = 'con_00000000-0000-0000-0000-000000000000';

    /* eslint-disable camelcase */
    const patchBody = { last_seen: '2024-06-15T10:30:00Z', customer_external_id: 'external_002' };
    /* eslint-enable camelcase */

    let requestBody;
    nock(config.API_BASE)
      .patch(`/v1/contacts/${contactUuid}`, body => { requestBody = body; return true; })
      .reply(200, {
        /* eslint-disable camelcase */
        uuid: contactUuid,
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000001',
        customer_external_id: 'external_002',
        last_seen: '2024-06-15T10:30:00.000Z'
        /* eslint-enable camelcase */
      });

    const contact = await Contact.modify(config, contactUuid, patchBody);
    expect(requestBody).to.deep.equal(patchBody);
    expect(contact.customer_external_id).to.equal('external_002');
    expect(contact.last_seen).to.equal('2024-06-15T10:30:00.000Z');
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

  describe('tasks', () => {
    const contactUuid = 'con_00000000-0000-0000-0000-000000000000';
    const contactIdentifier = { associated_object: 'contact', method: 'uuid', value: contactUuid };
    const taskParams = {
      /* eslint-disable camelcase */
      assignee: 'customer@example.com',
      task_details: 'This is some task details text.',
      due_date: '2025-04-30T00:00:00Z'
      /* eslint-enable camelcase */
    };

    it('lists tasks for a contact', async () => {
      nock(config.API_BASE)
        .get(`/v1/tasks?per_page=10&contact_uuid=${contactUuid}`)
        .reply(200, {
          /* eslint-disable camelcase */
          entries: [{
            task_uuid: '00000000-0000-0000-0000-000000000000',
            customer_uuid: null,
            associated_object: 'contact',
            associated_object_uuid: contactUuid,
            assignee: 'customer@example.com',
            task_details: 'This is some task details text.',
            due_date: '2025-04-30T00:00:00.000Z',
            completed_at: null,
            created_at: '2025-04-01T12:00:00.000Z',
            updated_at: '2025-04-01T12:00:00.000Z'
          }],
          cursor: 'OjAyMy0wOy0xM1QxMkowMTozMi64NF==',
          has_more: false
          /* eslint-enable camelcase */
        });

      const tasks = await Contact.tasks(config, contactUuid, { per_page: 10 });
      expect(tasks.entries).to.have.lengthOf(1);
      expect(tasks.entries[0].associated_object_uuid).to.equal(contactUuid);
      expect(tasks.has_more).to.equal(false);
    });

    it('creates a task for a contact by injecting associated_object_identifier', async () => {
      let requestBody;
      nock(config.API_BASE)
        .post('/v1/tasks', body => { requestBody = body; return true; })
        .reply(201, {
          /* eslint-disable camelcase */
          task_uuid: '00000000-0000-0000-0000-000000000000',
          customer_uuid: null,
          associated_object: 'contact',
          associated_object_uuid: contactUuid
          /* eslint-enable camelcase */
        });

      const task = await Contact.createTask(config, contactUuid, taskParams);
      expect(requestBody.associated_object_identifier).to.deep.equal(contactIdentifier);
      expect(requestBody).to.not.have.property('customer_uuid');
      expect(requestBody.task_details).to.equal(taskParams.task_details);
      // eslint-disable-next-line no-unused-expressions
      expect(task.customer_uuid).to.be.null;
    });

    it('keeps a caller-supplied customer_uuid when creating a task', async () => {
      const customerUuid = 'cus_00000000-0000-0000-0000-000000000000';

      let requestBody;
      nock(config.API_BASE)
        .post('/v1/tasks', body => { requestBody = body; return true; })
        .reply(201, { task_uuid: '00000000-0000-0000-0000-000000000000', customer_uuid: customerUuid });

      await Contact.createTask(config, contactUuid, { ...taskParams, customer_uuid: customerUuid });
      expect(requestBody.customer_uuid).to.equal(customerUuid);
      expect(requestBody).to.not.have.property('associated_object_identifier');
    });

    it('keeps a caller-supplied associated_object_identifier when creating a task', async () => {
      const customerIdentifier = {
        associated_object: 'customer', method: 'uuid', value: 'cus_00000000-0000-0000-0000-000000000000'
      };

      let requestBody;
      nock(config.API_BASE)
        .post('/v1/tasks', body => { requestBody = body; return true; })
        .reply(201, { task_uuid: '00000000-0000-0000-0000-000000000000' });

      await Contact.createTask(config, contactUuid, { ...taskParams, associated_object_identifier: customerIdentifier });
      expect(requestBody.associated_object_identifier).to.deep.equal(customerIdentifier);
    });
  });

  describe('entity notes', () => {
    const contactUuid = 'con_00000000-0000-0000-0000-000000000000';
    const contactIdentifier = { associated_object: 'contact', method: 'uuid', value: contactUuid };

    it('lists notes for a contact', async () => {
      nock(config.API_BASE)
        .get(`/v1/notes?type=call&contact_uuid=${contactUuid}`)
        .reply(200, {
          /* eslint-disable camelcase */
          entries: [{
            uuid: 'note_00000000-0000-0000-0000-000000000000',
            customer_uuid: null,
            associated_object: 'contact',
            associated_object_uuid: contactUuid,
            type: 'call',
            text: null,
            call_duration: 60,
            author: 'John Doe (john@example.com)',
            created_at: '2026-08-22T09:00:00.000Z',
            updated_at: '2026-08-22T09:00:00.000Z'
          }],
          cursor: 'MjAyNi0wOC0yMlQwOTowMDowMFo=',
          has_more: false
          /* eslint-enable camelcase */
        });

      const notes = await Contact.entityNotes(config, contactUuid, { type: 'call' });
      expect(notes.entries).to.have.lengthOf(1);
      expect(notes.entries[0].associated_object).to.equal('contact');
    });

    it('creates a note for a contact by injecting associated_object_identifier', async () => {
      let requestBody;
      nock(config.API_BASE)
        .post('/v1/notes', body => { requestBody = body; return true; })
        .reply(201, {
          /* eslint-disable camelcase */
          uuid: 'note_00000000-0000-0000-0000-000000000000',
          customer_uuid: null,
          associated_object: 'contact',
          associated_object_uuid: contactUuid,
          type: 'note',
          text: 'This is a contact note'
          /* eslint-enable camelcase */
        });

      const note = await Contact.createEntityNote(config, contactUuid, { type: 'note', text: 'This is a contact note' });
      expect(requestBody.associated_object_identifier).to.deep.equal(contactIdentifier);
      expect(requestBody).to.not.have.property('customer_uuid');
      // eslint-disable-next-line no-unused-expressions
      expect(note.customer_uuid).to.be.null;
      expect(note.text).to.equal('This is a contact note');
    });

    it('keeps a caller-supplied customer_uuid when creating a note', async () => {
      const customerUuid = 'cus_00000000-0000-0000-0000-000000000000';

      let requestBody;
      nock(config.API_BASE)
        .post('/v1/notes', body => { requestBody = body; return true; })
        .reply(201, { uuid: 'note_00000000-0000-0000-0000-000000000000', customer_uuid: customerUuid });

      await Contact.createEntityNote(config, contactUuid, { type: 'note', text: 'x', customer_uuid: customerUuid });
      expect(requestBody.customer_uuid).to.equal(customerUuid);
      expect(requestBody).to.not.have.property('associated_object_identifier');
    });
  });
});
