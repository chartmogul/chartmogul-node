'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const CustomerNote = ChartMogul.CustomerNote;

describe('CustomerNote', () => {
  it('retrieves a customer note', () => {
    const uuid = 'note_00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE)
      .get('/v1/customer_notes' + '/' + uuid)
      .reply(200, {
        /* eslint-disable camelcase */
        uuid: uuid,
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        type: 'note',
        text: 'This is a note',
        created_at: '2021-10-20T14:00:00.000Z',
        updated_at: '2021-10-20T14:00:00.000Z',
        author: 'John Doe (john@example.com)'
        /* eslint-enable camelcase */
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
        uuid: uuid,
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
          expect(res['text']).to.be.equal('This is a note');
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
