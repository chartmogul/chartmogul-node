'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const Task = ChartMogul.Task;

describe('Task', () => {
  it('creates a task', async () => {
    const customerUuid = 'cus_00000000-0000-0000-0000-000000000000';
    const postBody = {
      customer_uuid: customerUuid,
      assignee: 'customer@example.com',
      task_details: 'This is some task details text.',
      due_date: '2025-04-30T00:00:00Z',
      completed_at: '2025-04-20T00:00:00Z'
    };

    nock(config.API_BASE)
      .post('/v1/tasks', postBody)
      .reply(200, {
        task_uuid: '00000000-0000-0000-0000-000000000000',
        customer_uuid: customerUuid,
        assignee: 'customer@example.com',
        task_details: 'This is some task details text.',
        due_date: '2025-04-30T00:00:00Z',
        completed_at: '2025-04-20T00:00:00Z',
        created_at: '2025-04-01T12:00:00.000Z',
        updated_at: '2025-04-01T12:00:00.000Z'
      });

    const task = await Task.create(config, postBody);
    expect(task.task_uuid).to.equal('00000000-0000-0000-0000-000000000000');
    expect(task.customer_uuid).to.equal(customerUuid);
    expect(task.assignee).to.equal('customer@example.com');
    expect(task.task_details).to.equal('This is some task details text.');
    expect(task.due_date).to.equal('2025-04-30T00:00:00Z');
    expect(task.completed_at).to.equal('2025-04-20T00:00:00Z');
  });

  it('creates a task for a contact with associated_object_identifier', async () => {
    const contactUuid = 'con_00000000-0000-0000-0000-000000000000';
    const postBody = {
      associated_object_identifier: { associated_object: 'contact', method: 'uuid', value: contactUuid },
      assignee: 'customer@example.com',
      task_details: 'This is some task details text.',
      due_date: '2025-04-30T00:00:00Z'
    };

    nock(config.API_BASE)
      .post('/v1/tasks', postBody)
      .reply(201, {
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
      });

    const task = await Task.create(config, postBody);
    // eslint-disable-next-line no-unused-expressions
    expect(task.customer_uuid).to.be.null;
    expect(task.associated_object).to.equal('contact');
    expect(task.associated_object_uuid).to.equal(contactUuid);
  });

  it('lists tasks filtered by contact, assignee, due date range and completion', async () => {
    const contactUuid = 'con_00000000-0000-0000-0000-000000000000';
    const query = {
      contact_uuid: contactUuid,
      assignee: 'customer@example.com',
      due_date_on_or_after: '2025-04-01',
      due_date_on_or_before: '2025-04-30',
      completed: false,
      per_page: 10
    };

    nock(config.API_BASE)
      .get(`/v1/tasks?contact_uuid=${contactUuid}&assignee=customer%40example.com&due_date_on_or_after=2025-04-01&due_date_on_or_before=2025-04-30&completed=false&per_page=10`)
      .reply(200, { entries: [], cursor: null, has_more: false });

    const tasks = await Task.all(config, query);
    expect(tasks.entries).to.have.lengthOf(0);
    expect(tasks.has_more).to.equal(false);
  });

  it('resolves with an empty object when the update is a no-op', async () => {
    const uuid = '00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE)
      .patch(`/v1/tasks/${uuid}`, {})
      .reply(304);

    const task = await Task.patch(config, uuid, {});
    // eslint-disable-next-line no-unused-expressions
    expect(task).to.be.empty;
    expect(task).to.be.instanceof(Object);
  });

  it('lists all tasks', async () => {
    const customerUuid = 'cus_00000000-0000-0000-0000-000000000000';
    const body = { customer_uuid: customerUuid, per_page: 10, cursor: 'cursor==' };

    nock(config.API_BASE)
      .get(`/v1/tasks?customer_uuid=${customerUuid}&per_page=10&cursor=cursor==`)
      .reply(200, {
        entries: [{
          task_uuid: '00000000-0000-0000-0000-000000000000',
          customer_uuid: customerUuid,
          assignee: 'customer@example.com',
          task_details: 'This is some task details text.',
          due_date: '2025-04-30T00:00:00Z',
          completed_at: '2025-04-20T00:00:00Z',
          created_at: '2025-04-01T12:00:00.000Z',
          updated_at: '2025-04-01T12:00:00.000Z'
        }]
      });

    const tasks = await Task.all(config, body);
    expect(tasks).to.have.property('entries');
    expect(tasks.entries).to.be.instanceof(Array);
    expect(tasks.entries).to.have.lengthOf(1);
    expect(tasks.entries[0].task_uuid).to.equal('00000000-0000-0000-0000-000000000000');
    expect(tasks.entries[0].customer_uuid).to.equal(customerUuid);
    expect(tasks.entries[0].assignee).to.equal('customer@example.com');
    expect(tasks.entries[0].task_details).to.equal('This is some task details text.');
    expect(tasks.entries[0].due_date).to.equal('2025-04-30T00:00:00Z');
    expect(tasks.entries[0].completed_at).to.equal('2025-04-20T00:00:00Z');
  });

  it('retrieves a task', async () => {
    const uuid = '00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE)
      .get(`/v1/tasks/${uuid}`)
      .reply(200, {
        task_uuid: uuid,
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        assignee: 'customer@example.com',
        task_details: 'This is some task details text.',
        due_date: '2025-04-30T00:00:00Z',
        completed_at: '2025-04-20T00:00:00Z',
        created_at: '2025-04-01T12:00:00.000Z',
        updated_at: '2025-04-01T12:00:00.000Z'
      });

    const task = await Task.retrieve(config, uuid);
    expect(task.task_uuid).to.equal(uuid);
    expect(task.customer_uuid).to.equal('cus_00000000-0000-0000-0000-000000000000');
    expect(task.assignee).to.equal('customer@example.com');
    expect(task.task_details).to.equal('This is some task details text.');
    expect(task.due_date).to.equal('2025-04-30T00:00:00Z');
    expect(task.completed_at).to.equal('2025-04-20T00:00:00Z');
  });

  it('updates a task', async () => {
    const uuid = '00000000-0000-0000-0000-000000000000';
    const patchBody = {
      task_details: 'This is some other task details text.'
    };

    nock(config.API_BASE)
      .patch(`/v1/tasks/${uuid}`, patchBody)
      .reply(200, {
        task_uuid: uuid,
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        assignee: 'customer@example.com',
        task_details: 'This is some other task details text.',
        due_date: '2025-04-30T00:00:00Z',
        completed_at: '2025-04-20T00:00:00Z',
        created_at: '2025-04-01T12:00:00.000Z',
        updated_at: '2025-04-01T12:00:00.000Z'
      });

    const task = await Task.patch(config, uuid, patchBody);
    expect(task.task_uuid).to.equal(uuid);
    expect(task.customer_uuid).to.equal('cus_00000000-0000-0000-0000-000000000000');
    expect(task.assignee).to.equal('customer@example.com');
    expect(task.task_details).to.equal('This is some other task details text.');
    expect(task.due_date).to.equal('2025-04-30T00:00:00Z');
    expect(task.completed_at).to.equal('2025-04-20T00:00:00Z');
  });

  it('deletes a task', async () => {
    const uuid = '00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE).delete(`/v1/tasks/${uuid}`).reply(204);

    const task = await Task.destroy(config, uuid);
    // eslint-disable-next-line no-unused-expressions
    expect(task).to.be.empty;
    expect(task).to.be.instanceof(Object);
  });
});
