'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const CustomerNote = ChartMogul.CustomerNote;

describe('CustomerNote', () => {
  it('create a customer note', () => {
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

    CustomerNote.create(config, postBody)
      .then(res => {
        expect(res.customer_uuid).to.be.equal(uuid);
        expect(res.text).to.be.equal('This is a note');
      });
  });

  it('lists all customer notes', () => {
    const uuid = 'cus_00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE)
      .get('/v1/customer_notes')
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

    CustomerNote.all(config, uuid)
      .then(res => {
        expect(res.entries).to.haveLength(1);
      });
  });

  it('retrieves a customer note', () => {
    const uuid = 'note_00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE)
      .get('/v1/customer_notes' + '/' + uuid)
      .reply(200, {
        uuid,
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        type: 'note',
        text: 'This is a note',
        created_at: '2021-10-20T14:00:00.000Z',
        updated_at: '2021-10-20T14:00:00.000Z',
        author: 'John Doe (john@example.com)'
      });

    CustomerNote.retrieve(config, uuid).then(res => {
      expect(res).to.have.property('uuid');
    });
  });

  it('updates a customer note', () => {
    const uuid = 'note_00000000-0000-0000-0000-000000000000';
    const postBody = {
      text: 'This is a note'
    };

    nock(config.API_BASE)
      .patch('/v1/customer_notes' + '/' + uuid, postBody)
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

    CustomerNote.patch(config, uuid, postBody)
      .then(res => {
        expect(res.text).to.be.equal('This is a note');
      });
  });

  it('deletes a customer note', () => {
    const uuid = 'con_00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE)
      .delete('/v1/customer_notes' + '/' + uuid)
      .reply(204);

    CustomerNote.destroy(config, uuid)
      .then(res => {
        expect(res).to.be.equal({});
      });
  });
});
