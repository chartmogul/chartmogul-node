'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const CustomerNote = ChartMogul.CustomerNote;

describe('CustomerNote', () => {
  it('creates a note from a customer', () => {
    const uuid = 'cus_00000000-0000-0000-0000-000000000000';
    const postBody = {
      customer_uuid: uuid,
      type: 'note',
      text: 'This is a note'
    };

    nock(config.API_BASE)
      .post('/v1/customer_notes', postBody)
      .reply(200, {
        uuid: 'note_00000000-0000-0000-0000-000000000000',
        customer_uuid: uuid,
        type: 'note',
        text: 'This is a note',
        created_at: '2021-10-20T14:00:00.000Z',
        updated_at: '2021-10-20T14:00:00.000Z',
        author: 'John Doe (john@example.com)'
      });

    return CustomerNote.create(config, postBody)
      .then(res => {
        expect(res.customer_uuid).to.be.equal(uuid);
        expect(res.text).to.be.equal('This is a note');
      });
  });

  it('lists all notes from a customer', async () => {
    const uuid = 'cus_00000000-0000-0000-0000-000000000000';
    const body = { customer_uuid: uuid, per_page: 10, cursor: 'cursor==' };

    nock(config.API_BASE)
      .get(`/v1/customer_notes?customer_uuid=${uuid}&per_page=10&cursor=cursor==`)
      .reply(200, {
        entries: [{
          uuid: 'note_00000000-0000-0000-0000-000000000000',
          customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
          author: 'John Doe (john@example.com)',
          text: 'This is a note',
          created_at: '2015-01-01T12:00:00-05:00',
          updated_at: '2015-01-01T12:00:00-05:00',
          type: 'note'
        }]
      });

    const customerNote = await CustomerNote.all(config, body);
    expect(customerNote.entries).to.have.lengthOf(1);
    expect(customerNote.entries[0].customer_uuid).to.equal(uuid);
  });

  it('retrieves a customer note', () => {
    const uuid = 'note_00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE)
      .get(`/v1/customer_notes/${uuid}`)
      .reply(200, {
        uuid,
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        type: 'note',
        text: 'This is a note',
        created_at: '2021-10-20T14:00:00.000Z',
        updated_at: '2021-10-20T14:00:00.000Z',
        author: 'John Doe (john@example.com)'
      });

    return CustomerNote.retrieve(config, uuid).then(res => {
      expect(res).to.have.property('uuid');
      expect(res.uuid).to.equal(uuid);
    });
  });

  it('updates a customer note', () => {
    const uuid = 'note_00000000-0000-0000-0000-000000000000';
    const postBody = {
      text: 'This is a note'
    };

    nock(config.API_BASE)
      .patch(`/v1/customer_notes/${uuid}`, postBody)
      .reply(200, {
        /* eslint-disable camelcase */
        uuid,
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        type: 'note',
        text: 'This is a note',
        created_at: '2021-10-20T14:00:00.000Z',
        updated_at: '2021-10-20T14:00:00.000Z',
        author: 'John Doe (john@example.com)'
        /* eslint-enable camelcase */
      });

    return CustomerNote.patch(config, uuid, postBody)
      .then(res => {
        expect(res.text).to.be.equal('This is a note');
      });
  });

  it('deletes a customer note', () => {
    const uuid = 'con_00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE)
      .delete(`/v1/customer_notes/${uuid}`)
      .reply(204);

    return CustomerNote.destroy(config, uuid)
      .then(res => {
        // eslint-disable-next-line no-unused-expressions
        expect(res).to.be.empty;
      });
  });
});
