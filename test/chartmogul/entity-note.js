'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const EntityNote = ChartMogul.EntityNote;

describe('EntityNote', () => {
  const customerUuid = 'cus_00000000-0000-0000-0000-000000000000';
  const contactUuid = 'con_00000000-0000-0000-0000-000000000000';
  const noteUuid = 'note_00000000-0000-0000-0000-000000000000';

  it('creates a note for a customer', async () => {
    const postBody = {
      customer_uuid: customerUuid,
      type: 'note',
      author_email: 'john@example.com',
      text: 'This is a note'
    };

    nock(config.API_BASE)
      .post('/v1/notes', postBody)
      .reply(201, {
        uuid: noteUuid,
        customer_uuid: customerUuid,
        associated_object: 'customer',
        associated_object_uuid: customerUuid,
        type: 'note',
        text: 'This is a note',
        call_duration: 0,
        author: 'John Doe (john@example.com)',
        created_at: '2026-08-22T09:00:00.000Z',
        updated_at: '2026-08-22T09:00:00.000Z'
      });

    const note = await EntityNote.create(config, postBody);
    expect(note.uuid).to.equal(noteUuid);
    expect(note.customer_uuid).to.equal(customerUuid);
    expect(note.associated_object).to.equal('customer');
    expect(note.type).to.equal('note');
    expect(note.text).to.equal('This is a note');
  });

  it('creates a note for a contact with associated_object_identifier', async () => {
    const postBody = {
      associated_object_identifier: { associated_object: 'contact', method: 'uuid', value: contactUuid },
      type: 'note',
      text: 'This is a contact note'
    };

    nock(config.API_BASE)
      .post('/v1/notes', postBody)
      .reply(201, {
        uuid: noteUuid,
        customer_uuid: null,
        associated_object: 'contact',
        associated_object_uuid: contactUuid,
        type: 'note',
        text: 'This is a contact note',
        call_duration: 0,
        author: 'John Doe (john@example.com)',
        created_at: '2026-08-22T09:00:00.000Z',
        updated_at: '2026-08-22T09:00:00.000Z'
      });

    const note = await EntityNote.create(config, postBody);
    // eslint-disable-next-line no-unused-expressions
    expect(note.customer_uuid).to.be.null;
    expect(note.associated_object).to.equal('contact');
    expect(note.associated_object_uuid).to.equal(contactUuid);
  });

  it('creates a call log', async () => {
    const postBody = {
      customer_uuid: customerUuid,
      type: 'call',
      call_duration: 120,
      created_at: '2026-08-20T09:00:00Z'
    };

    nock(config.API_BASE)
      .post('/v1/notes', postBody)
      .reply(201, {
        uuid: noteUuid,
        customer_uuid: customerUuid,
        type: 'call',
        text: null,
        call_duration: 120,
        author: 'John Doe (john@example.com)',
        created_at: '2026-08-20T09:00:00.000Z',
        updated_at: '2026-08-20T09:00:00.000Z'
      });

    const note = await EntityNote.create(config, postBody);
    expect(note.type).to.equal('call');
    expect(note.call_duration).to.equal(120);
  });

  it('lists notes with filters and pagination', async () => {
    const query = {
      customer_uuid: customerUuid,
      contact_uuid: contactUuid,
      type: 'note',
      author_email: 'john@example.com',
      per_page: 10,
      cursor: 'cursor=='
    };

    nock(config.API_BASE)
      .get('/v1/notes')
      .query(query)
      .reply(200, {
        entries: [{
          uuid: noteUuid,
          customer_uuid: customerUuid,
          type: 'note',
          text: 'This is a note',
          call_duration: 0,
          author: 'John Doe (john@example.com)',
          created_at: '2026-08-22T09:00:00.000Z',
          updated_at: '2026-08-22T09:00:00.000Z'
        }],
        cursor: 'MjAyNi0wOC0yMlQwOTowMDowMFo=',
        has_more: false
      });

    const notes = await EntityNote.all(config, query);
    expect(notes.entries).to.have.lengthOf(1);
    expect(notes.entries[0].uuid).to.equal(noteUuid);
    expect(notes.cursor).to.equal('MjAyNi0wOC0yMlQwOTowMDowMFo=');
    expect(notes.has_more).to.equal(false);
  });

  it('throws DeprecatedParamError if using old pagination parameter', async () => {
    const query = { page: 1 };

    nock(config.API_BASE)
      .get('/v1/notes')
      .query(query)
      .reply(200, {});

    await EntityNote.all(config, query)
      .catch(e => {
        expect(e).to.be.instanceOf(ChartMogul.DeprecatedParamError);
        expect(e.message).to.equal('"page" param is deprecated {}');
        expect(e.httpStatus).to.equal(422);
      });
  });

  it('retrieves a note', async () => {
    nock(config.API_BASE)
      .get(`/v1/notes/${noteUuid}`)
      .reply(200, {
        uuid: noteUuid,
        customer_uuid: customerUuid,
        type: 'note',
        text: 'This is a note',
        call_duration: 0,
        author: 'John Doe (john@example.com)',
        created_at: '2026-08-22T09:00:00.000Z',
        updated_at: '2026-08-22T09:00:00.000Z'
      });

    const note = await EntityNote.retrieve(config, noteUuid);
    expect(note.uuid).to.equal(noteUuid);
  });

  it('updates a note', async () => {
    const patchBody = { text: 'This is an updated note' };

    nock(config.API_BASE)
      .patch(`/v1/notes/${noteUuid}`, patchBody)
      .reply(200, {
        uuid: noteUuid,
        customer_uuid: customerUuid,
        type: 'note',
        text: 'This is an updated note',
        call_duration: 0,
        author: 'John Doe (john@example.com)',
        created_at: '2026-08-22T09:00:00.000Z',
        updated_at: '2026-08-23T09:00:00.000Z'
      });

    const note = await EntityNote.patch(config, noteUuid, patchBody);
    expect(note.text).to.equal('This is an updated note');
  });

  it('resolves with an empty object when the update is a no-op', async () => {
    nock(config.API_BASE)
      .patch(`/v1/notes/${noteUuid}`, {})
      .reply(304);

    const note = await EntityNote.patch(config, noteUuid, {});
    // eslint-disable-next-line no-unused-expressions
    expect(note).to.be.empty;
    expect(note).to.be.instanceof(Object);
  });

  it('deletes a note', async () => {
    nock(config.API_BASE)
      .delete(`/v1/notes/${noteUuid}`)
      .reply(202, { message: 'Note deleted' });

    const result = await EntityNote.destroy(config, noteUuid);
    expect(result.message).to.equal('Note deleted');
  });
});
