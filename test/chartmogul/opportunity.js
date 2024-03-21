'use strict';

const ChartMogul = require('../../lib/chartmogul');
const config = new ChartMogul.Config('token');
const expect = require('chai').expect;
const nock = require('nock');
const Opportunity = ChartMogul.Opportunity;

describe('Opportunity', () => {
  it('creates a opportunity for a customer', async () => {
    const uuid = 'cus_00000000-0000-0000-0000-000000000000';
    const postBody = {
      customer_uuid: uuid,
      owner: 'test1@example.org',
      pipeline: 'New business 1',
      pipeline_stage: 'Discovery',
      estimated_close_date: '2023-12-22',
      currency: 'USD',
      amount_in_cents: 100,
      type: 'recurring',
      forecast_category: 'pipeline',
      win_likelihood: 3,
      custom: [{ key: 'from_campaign', value: 'true' }]
    };

    nock(config.API_BASE)
      .post('/v1/opportunities', postBody)
      .reply(200, {
        uuid: '00000000-0000-0000-0000-000000000000',
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        owner: 'test1@example.org',
        pipeline: 'New business 1',
        pipeline_stage: 'Discovery',
        estimated_close_date: '2023-12-22',
        currency: 'USD',
        amount_in_cents: 100,
        type: 'recurring',
        forecast_category: 'pipeline',
        win_likelihood: 3,
        custom: { from_campaign: 'true' },
        created_at: '2024-03-13T07:33:28.356Z',
        updated_at: '2024-03-13T07:33:28.356Z'
      });

    const opportunity = await Opportunity.create(config, postBody);
    expect(opportunity.customer_uuid).to.be.equal(uuid);
    expect(opportunity.owner).to.be.equal('test1@example.org');
    expect(opportunity.pipeline).to.be.equal('New business 1');
    expect(opportunity.pipeline_stage).to.be.equal('Discovery');
    expect(opportunity.estimated_close_date).to.be.equal('2023-12-22');
    expect(opportunity.currency).to.be.equal('USD');
    expect(opportunity.amount_in_cents).to.be.equal(100);
    expect(opportunity.type).to.be.equal('recurring');
    expect(opportunity.forecast_category).to.be.equal('pipeline');
    expect(opportunity.win_likelihood).to.be.equal(3);
    expect(opportunity.custom).to.deep.equal({ from_campaign: 'true' });
  });

  it('lists all opportunities from a customer', async () => {
    const uuid = 'cus_00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE)
      .get(`/v1/opportunities/${uuid}`)
      .reply(200, {
        entries: [
          {
            uuid: '00000000-0000-0000-0000-000000000000',
            customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
            owner: 'test1@example.org',
            pipeline: 'New business 1',
            pipeline_stage: 'Discovery',
            estimated_close_date: '2023-12-22',
            currency: 'USD',
            amount_in_cents: 100,
            type: 'recurring',
            forecast_category: 'pipeline',
            win_likelihood: 3,
            custom: { from_campaign: 'true' },
            created_at: '2024-03-13T07:33:28.356Z',
            updated_at: '2024-03-13T07:33:28.356Z'
          }
        ]
      });

    const opportunity = await Opportunity.all(config, uuid);
    expect(opportunity.entries).to.have.length(1);
  });

  it('retrieves an opportunity', async () => {
    const uuid = '00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE)
      .get(`/v1/opportunities/${uuid}`)
      .reply(200, {
        uuid: '00000000-0000-0000-0000-000000000000',
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        owner: 'test1@example.org',
        pipeline: 'New business 1',
        pipeline_stage: 'Discovery',
        estimated_close_date: '2023-12-22',
        currency: 'USD',
        amount_in_cents: 100,
        type: 'recurring',
        forecast_category: 'pipeline',
        win_likelihood: 3,
        custom: { from_campaign: 'true' },
        created_at: '2024-03-13T07:33:28.356Z',
        updated_at: '2024-03-13T07:33:28.356Z'
      });

    const opportunity = await Opportunity.retrieve(config, uuid);
    expect(opportunity.uuid).to.be.equal(uuid);
    expect(opportunity.customer_uuid).to.be.equal(
      'cus_00000000-0000-0000-0000-000000000000'
    );
    expect(opportunity.owner).to.be.equal('test1@example.org');
    expect(opportunity.pipeline).to.be.equal('New business 1');
    expect(opportunity.pipeline_stage).to.be.equal('Discovery');
    expect(opportunity.estimated_close_date).to.be.equal('2023-12-22');
    expect(opportunity.currency).to.be.equal('USD');
    expect(opportunity.amount_in_cents).to.be.equal(100);
    expect(opportunity.type).to.be.equal('recurring');
    expect(opportunity.forecast_category).to.be.equal('pipeline');
    expect(opportunity.win_likelihood).to.be.equal(3);
    expect(opportunity.custom).to.deep.equal({ from_campaign: 'true' });
  });

  it('updates an opportunity', async () => {
    const uuid = '00000000-0000-0000-0000-000000000000';
    const postBody = {
      estimated_close_date: '2024-12-22'
    };

    nock(config.API_BASE)
      .patch(`/v1/opportunities/${uuid}`, postBody)
      .reply(200, {
        uuid: '00000000-0000-0000-0000-000000000000',
        customer_uuid: 'cus_00000000-0000-0000-0000-000000000000',
        owner: 'test1@example.org',
        pipeline: 'New business 1',
        pipeline_stage: 'Discovery',
        estimated_close_date: '2024-12-22',
        currency: 'USD',
        amount_in_cents: 100,
        type: 'recurring',
        forecast_category: 'pipeline',
        win_likelihood: 3,
        custom: { from_campaign: 'true' },
        created_at: '2024-03-13T07:33:28.356Z',
        updated_at: '2024-03-13T07:33:28.356Z'
      });

    const opportunity = await Opportunity.patch(config, uuid, postBody);
    expect(opportunity.uuid).to.be.equal(uuid);
    expect(opportunity.customer_uuid).to.be.equal(
      'cus_00000000-0000-0000-0000-000000000000'
    );
    expect(opportunity.owner).to.be.equal('test1@example.org');
    expect(opportunity.pipeline).to.be.equal('New business 1');
    expect(opportunity.pipeline_stage).to.be.equal('Discovery');
    expect(opportunity.estimated_close_date).to.be.equal('2024-12-22');
    expect(opportunity.currency).to.be.equal('USD');
    expect(opportunity.amount_in_cents).to.be.equal(100);
    expect(opportunity.type).to.be.equal('recurring');
    expect(opportunity.forecast_category).to.be.equal('pipeline');
    expect(opportunity.win_likelihood).to.be.equal(3);
    expect(opportunity.custom).to.deep.equal({ from_campaign: 'true' });
  });

  it('deletes an opportunity', async () => {
    const uuid = '00000000-0000-0000-0000-000000000000';

    nock(config.API_BASE).delete(`/v1/opportunities/${uuid}`).reply(204);

    const result = await Opportunity.destroy(config, uuid);
    expect(result).to.deep.equal({});
  });
});
