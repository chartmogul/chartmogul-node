'use strict';

const ChartMogul = require('../../../lib/chartmogul');
const config = new ChartMogul.Config('token', 'secret');
const expect = require('chai').expect;
const nock = require('nock');
const Metrics = ChartMogul.Metrics;

describe('Metrics', () => {
  it('should retrieve all key metrics', () => {
    const query = {
      'start-date': '2015-01-01',
      'end-date': '2015-11-24',
      'interval': 'month',
      'geo': 'GB',
      'plans': 'Bronze Plan'
    };

    nock(config.API_BASE)
    .get('/v1/metrics/all')
    .query(query)
    .reply(200, {
      /* eslint-disable camelcase */
      entries:
        [{ date: '2015-01-31',
           'customer-churn-rate': 0,
           'mrr-churn-rate': 0,
           ltv: 0,
           customers: 0,
           asp: 0,
           arpa: 0,
           arr: 0,
           mrr: 0 },
         { date: '2015-02-28',
           'customer-churn-rate': 0,
           'mrr-churn-rate': 0,
           ltv: 0,
           customers: 0,
           asp: 0,
           arpa: 0,
           arr: 0,
           mrr: 0 },
         { date: '2015-03-31',
           'customer-churn-rate': 0,
           'mrr-churn-rate': 0,
           ltv: 0,
           customers: 0,
           asp: 0,
           arpa: 0,
           arr: 0,
           mrr: 0 },
         { date: '2015-04-30',
           'customer-churn-rate': 0,
           'mrr-churn-rate': 0,
           ltv: 0,
           customers: 0,
           asp: 0,
           arpa: 0,
           arr: 0,
           mrr: 0 },
         { date: '2015-05-31',
           'customer-churn-rate': 0,
           'mrr-churn-rate': 0,
           ltv: 0,
           customers: 0,
           asp: 0,
           arpa: 0,
           arr: 0,
           mrr: 0 },
         { date: '2015-06-30',
           'customer-churn-rate': 0,
           'mrr-churn-rate': 0,
           ltv: 0,
           customers: 0,
           asp: 0,
           arpa: 0,
           arr: 0,
           mrr: 0 },
         { date: '2015-07-31',
           'customer-churn-rate': 0,
           'mrr-churn-rate': 0,
           ltv: 0,
           customers: 0,
           asp: 0,
           arpa: 0,
           arr: 0,
           mrr: 0 },
         { date: '2015-08-31',
           'customer-churn-rate': 0,
           'mrr-churn-rate': 0,
           ltv: 0,
           customers: 0,
           asp: 0,
           arpa: 0,
           arr: 0,
           mrr: 0 },
         { date: '2015-09-30',
           'customer-churn-rate': 0,
           'mrr-churn-rate': 0,
           ltv: 0,
           customers: 0,
           asp: 0,
           arpa: 0,
           arr: 0,
           mrr: 0 },
         { date: '2015-10-31',
           'customer-churn-rate': 0,
           'mrr-churn-rate': 0,
           ltv: 0,
           customers: 0,
           asp: 0,
           arpa: 0,
           arr: 0,
           mrr: 0 },
         { date: '2015-11-24',
           'customer-churn-rate': 0,
           'mrr-churn-rate': 0,
           ltv: 0,
           customers: 0,
           asp: 0,
           arpa: 0,
           arr: 0,
           mrr: 0 } ]
      /* eslint-enable camelcase */
    });

    return Metrics.all(config, query)
    .then(res => {
      expect(res).to.have.property('entries');
      expect(res.entries).to.be.instanceof(Array);
    });
  });

  it('should retrieve MRR', () => {
    const query = {
      'start-date': '2015-01-01',
      'end-date': '2015-11-24',
      'interval': 'week'
    };

    nock(config.API_BASE)
    .get('/v1/metrics/mrr')
    .query(query)
    .reply(200, {
      /* eslint-disable camelcase */
      entries: [{
        date: '2015-01-03',
        mrr: 0,
        'mrr-new-business': 0,
        'mrr-expansion': 0,
        'mrr-contraction': 0,
        'mrr-churn': 0,
        'mrr-reactivation': 0
      }],
      summary: { current: 0, previous: 4100, 'percentage-change': -100 }
      /* eslint-enable camelcase */
    });

    return Metrics.mrr(config, query)
    .then(res => {
      expect(res).to.have.property('entries');
      expect(res.entries).to.be.instanceof(Array);
      expect(res).to.have.property('summary');
    });
  });

  it('should retrieve ARR', () => {
    const query = {
      'start-date': '2015-01-01',
      'end-date': '2015-11-24',
      'interval': 'month',
      'geo': 'US'
    };

    nock(config.API_BASE)
    .get('/v1/metrics/arr')
    .query(query)
    .reply(200, {
      /* eslint-disable camelcase */
      entries: [ { date: '2015-01-31', arr: 0 } ],
      summary: { current: 0, previous: 49200, 'percentage-change': -100 }
      /* eslint-enable camelcase */
    });

    return Metrics.arr(config, query)
    .then(res => {
      expect(res).to.have.property('entries');
      expect(res.entries).to.be.instanceof(Array);
      expect(res).to.have.property('summary');
    });
  });

  it('should retrieve ARPA', () => {
    const query = {
      'start-date': '2015-01-01',
      'end-date': '2015-11-24',
      'interval': 'week'
    };

    nock(config.API_BASE)
    .get('/v1/metrics/arpa')
    .query(query)
    .reply(200, {
      /* eslint-disable camelcase */
      entries: [ { date: '2015-01-03', arpa: 0 } ],
      summary: { current: 0, previous: 4100, 'percentage-change': -100 }
      /* eslint-enable camelcase */
    });

    return Metrics.arpa(config, query)
    .then(res => {
      expect(res).to.have.property('entries');
      expect(res.entries).to.be.instanceof(Array);
      expect(res).to.have.property('summary');
    });
  });

  it('should retrieve ASP', () => {
    const query = {
      'start-date': '2015-01-01',
      'end-date': '2015-11-24',
      'interval': 'month'
    };

    nock(config.API_BASE)
    .get('/v1/metrics/asp')
    .query(query)
    .reply(200, {
      /* eslint-disable camelcase */
      entries: [ { date: '2015-01-03', asp: 0 } ],
      summary: { current: 0, previous: 0, 'percentage-change': 0 }
      /* eslint-enable camelcase */
    });

    return Metrics.asp(config, query)
    .then(res => {
      expect(res).to.have.property('entries');
      expect(res.entries).to.be.instanceof(Array);
      expect(res).to.have.property('summary');
    });
  });

  it('should retrieve Customer Count', () => {
    const query = {
      'start-date': '2015-01-01',
      'end-date': '2015-11-24',
      'interval': 'month'
    };

    nock(config.API_BASE)
    .get('/v1/metrics/customer-count')
    .query(query)
    .reply(200, {
      /* eslint-disable camelcase */
      entries: [ { date: '2015-01-31', customers: 0 } ],
      summary: { current: 0, previous: 1, 'percentage-change': -100 }
      /* eslint-enable camelcase */
    });

    return Metrics.customerCount(config, query)
    .then(res => {
      expect(res).to.have.property('entries');
      expect(res.entries).to.be.instanceof(Array);
      expect(res).to.have.property('summary');
    });
  });

  it('should retrieve Customer Churn Rate', () => {
    const query = {
      'start-date': '2015-01-01',
      'end-date': '2015-11-24'
    };

    nock(config.API_BASE)
    .get('/v1/metrics/customer-churn-rate')
    .query(query)
    .reply(200, {
      /* eslint-disable camelcase */
      entries: [ { date: '2015-01-31', 'customer-churn-rate': 0 } ],
      summary: { current: 0, previous: 0, 'percentage-change': 0 }
      /* eslint-enable camelcase */
    });

    return Metrics.customerChurnRate(config, query)
    .then(res => {
      expect(res).to.have.property('entries');
      expect(res.entries).to.be.instanceof(Array);
      expect(res).to.have.property('summary');
    });
  });

  it('should retrieve MRR Churn Rate', () => {
    const query = {
      'start-date': '2015-01-01',
      'end-date': '2015-11-24'
    };

    nock(config.API_BASE)
    .get('/v1/metrics/mrr-churn-rate')
    .query(query)
    .reply(200, {
      /* eslint-disable camelcase */
      entries: [ { date: '2015-01-31', 'mrr-churn-rate': 0 } ],
      summary: { current: 0, previous: 0, 'percentage-change': 0 }
      /* eslint-enable camelcase */
    });

    return Metrics.mrrChurnRate(config, query)
    .then(res => {
      expect(res).to.have.property('entries');
      expect(res.entries).to.be.instanceof(Array);
      expect(res).to.have.property('summary');
    });
  });

  it('should retrieve LTV', () => {
    const query = {
      'start-date': '2015-01-01',
      'end-date': '2015-11-24'
    };

    nock(config.API_BASE)
    .get('/v1/metrics/ltv')
    .query(query)
    .reply(200, {
      /* eslint-disable camelcase */
      entries: [ { date: '2015-01-31', 'ltv': 0 } ],
      summary: { current: 0, previous: 0, 'percentage-change': 0 }
      /* eslint-enable camelcase */
    });

    return Metrics.ltv(config, query)
    .then(res => {
      expect(res).to.have.property('entries');
      expect(res.entries).to.be.instanceof(Array);
      expect(res).to.have.property('summary');
    });
  });

  it('should list customer activites', () => {
    const customerUuid = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';

    nock(config.API_BASE)
    .get(`/v1/customers/${customerUuid}/activities`)
    .reply(200, {
      /* eslint-disable camelcase */
      entries: [ { id: 495366,
        description: 'purchased the Bronze Plan plan with $10.00 discount applied',
        'activity-mrr-movement': 4100,
        'activity-mrr': 4100,
        'activity-arr': 49200,
        date: '2015-11-01T00:00:00+00:00',
        type: 'new_biz',
        currency: 'USD',
        'currency-sign': '$'
      }],
      has_more: false,
      per_page: 200,
      page: 1
      /* eslint-enable camelcase */
    });

    return Metrics.Customer.activities(config, customerUuid)
    .then(res => {
      expect(res).to.have.property('entries');
      expect(res.entries).to.be.instanceof(Array);
    });
  });

  it('should list customer subscriptions', () => {
    const customerUuid = 'cus_9bf6482d-01e5-4944-957d-5bc730d2cda3';

    nock(config.API_BASE)
    .get(`/v1/customers/${customerUuid}/subscriptions`)
    .reply(200, {
      /* eslint-disable camelcase */
      entries: [{
        id: 297047,
        plan: 'Bronze Plan',
        quantity: 0,
        mrr: 0,
        arr: 0,
        status: 'inactive',
        'billing-cycle': 'month',
        'billing-cycle-count': 1,
        'start-date': '2016-01-15T00:00:00+00:00',
        'end-date': '2016-01-15T00:00:00+00:00',
        currency: 'USD',
        'currency-sign': '$'
      }],
      has_more: false,
      per_page: 200,
      page: 1
      /* eslint-enable camelcase */
    });

    return Metrics.Customer.subscriptions(config, customerUuid)
    .then(res => {
      expect(res).to.have.property('entries');
      expect(res.entries).to.be.instanceof(Array);
    });
  });
});
