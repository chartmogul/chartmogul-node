<p align="center">
<a href="https://chartmogul.com"><img width="200" src="https://user-images.githubusercontent.com/5329361/42206299-021e4184-7ea7-11e8-8160-8ecd5d9948b8.png"></a>
</p>

<h3 align="center">Official ChartMogul API Node.js Client</h3>

<p align="center"><code>chartmogul-node</code> provides convenient Node.js bindings for <a href="https://dev.chartmogul.com">ChartMogul's API</a>.</p>
<p align="center">
  <a href="https://www.npmjs.com/package/chartmogul-node"><img src="https://badge.fury.io/js/chartmogul-node.svg" alt="npm Package" /></a>
  <a href="https://travis-ci.org/chartmogul/chartmogul-node"><img src="https://travis-ci.org/chartmogul/chartmogul-node.svg?branch=master" alt="Build Status"/></a>
</p>
<hr>

<p align="center">
<b><a href="#installation">Installation</a></b>
|
<b><a href="#configuration">Configuration</a></b>
|
<b><a href="#usage">Usage</a></b>
|
<b><a href="#development">Development</a></b>
|
<b><a href="#contributing">Contributing</a></b>
|
<b><a href="#license">License</a></b>
</p>
<hr>
<br>

## Installation

This library requires node.js 4.x or above.

```sh
npm install --save chartmogul-node
```

## Configuration

First create a `Config` object by passing your account token and secret key, available from the administration section of your ChartMogul account.

```js
const ChartMogul = require('chartmogul-node');
const config = new ChartMogul.Config(process.env.CHARTMOGUL_ACCOUNT_TOKEN, process.env.CHARTMOGUL_SECRET_KEY);
```

You need to pass this config object as the first argument to each request.


### Test your authentication
```js
ChartMogul.Ping.ping(config)
    .then(res => console.log(res))
    .catch(err => console.error(err))
```

## Usage

The library can be used both with promise and callback patterns. Supply the callback function as the last argmunent.

Here are sample examples:

**Using as promise**

```js
const ChartMogul = require('chartmogul-node');

const config = new ChartMogul.Config('accountToken', 'secretKey');

ChartMogul.Customer.create(config, {
  data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1',
  external_id: 'cus_0001',
  name: 'Adam Smith',
  email: 'adam@smith.com',
  country: 'US',
  city: 'New York'
})
.then(res => {
  console.log(res);
})
.catch(e => console.error(e.message, e.httpStatus, e.response));

```

**Using with a callback**

```js
const ChartMogul = require('chartmogul-node');

const config = new ChartMogul.Config('accountToken', 'secretKey');

ChartMogul.Customer.create(config, data, (err, res) => {
  if(err){
    console.error(err.message, err.httpStatus, err.response)
  }
  console.log(res);
});
```

### Import API

Available methods in Import API:

#### [Data Sources](https://dev.chartmogul.com/docs/data-sources)

```js
ChartMogul.DataSource.create(config, data)
ChartMogul.DataSource.retrieve(config, uuid)
ChartMogul.DataSource.all(config, query)
ChartMogul.DataSource.destroy(config, dataSourceUuid)
```

#### [Customers](https://dev.chartmogul.com/docs/customers)

```js
ChartMogul.Customer.create(config, data)
ChartMogul.Customer.all(config, {
  page: 2,
  per_page: 20
})
ChartMogul.Customer.destroy(config, customerUuid)
```

#### [Plans](https://dev.chartmogul.com/docs/plans)

```js
ChartMogul.Plan.create(config, data)
ChartMogul.Plan.retrieve(config, uuid)
ChartMogul.Plan.modify(config, uuid, {
    name: "new name"
})
ChartMogul.Plan.all(config, query)
ChartMogul.Plan.destroy(config, uuid)
```

#### [Invoices](https://dev.chartmogul.com/docs/invoices)

```js
ChartMogul.Invoice.create(config, customerUuid, data)
ChartMogul.Invoice.all(config, customerUuid, query)
ChartMogul.Invoice.all(config, query)
ChartMogul.Invoice.retrieve(config, invoiceUuid)
```

#### [Transactions](https://dev.chartmogul.com/docs/transactions)

```js
ChartMogul.Transaction.create(config, invoiceUuid, data)
```

#### [Subscriptions](https://dev.chartmogul.com/docs/subscriptions)

```js
ChartMogul.Subscription.all(config, customerUuid, query)
ChartMogul.Subscription.cancel(config, subscriptionUuid, {cancelled_at: ""})
ChartMogul.Subscription.modify(config, subscriptionUuid, {cancellation_dates: []})
```

### Enrichment API

Available methods in Enrichment API:


#### [Customers](https://dev.chartmogul.com/docs/retrieve-customer)

```js
ChartMogul.Customer.retrieve(config, customerUuid)
ChartMogul.Customer.all(config, query)
ChartMogul.Customer.search(config, {
  email: 'adam@smith.com'
})

ChartMogul.Customer.merge(config, {
  "from": {"customer_uuid": "cus_5915ee5a-babd-406b-b8ce-d207133fb4cb"},
  "into": {"customer_uuid": "cus_2123290f-09c8-4628-a205-db5596bd58f7"}
})

ChartMogul.Customer.modify(config, "cus_5915ee5a-babd-406b-b8ce-d207133fb4cb", {
  "lead_created_at": "2015-01-01 00:00:00",
  "free_trial_started_at": "2015-06-13 15:45:13"
})

ChartMogul.Customer.connectSubscriptions(config, "cus_5915ee5a-babd-406b-b8ce-d207133fb4cb", {
    "subscriptions": [{
            "data_source_uuid": "ds_ade45e52-47a4-231a-1ed2-eb6b9e541213",
            "external_id": "d1c0c885-add0-48db-8fa9-0bdf5017d6b0"
        },
        {
            "data_source_uuid": "ds_ade45e52-47a4-231a-1ed2-eb6b9e541213",
            "external_id": "9db5f4a1-1695-44c0-8bd4-de7ce4d0f1d4"
        }
    ]
})
```

#### [Customer Attributes](https://dev.chartmogul.com/docs/customer-attributes)

```js
ChartMogul.Customer.attributes(config, customerUuid)
```

#### [Tags](https://dev.chartmogul.com/docs/tags)

```js
ChartMogul.Tag.add(config, customerUuid, {
  "tags": ["important", "Prio1"]
});
ChartMogul.Tag.add(config, {
  "email": 'adam@smith.com',
  "tags": ["important", "Prio1"]
});
ChartMogul.Tag.remove(config, customerUuid, {
  "tags": ["Prio1", "discountable"]
});
```


#### [Custom Attributes](https://dev.chartmogul.com/docs/custom-attributes)

```js
ChartMogul.CustomAttribute.add(config, customerUuid, {
  'custom': [
    {'type': 'Integer', 'key': 'age', 'value': 8}
  ]
});
ChartMogul.CustomAttribute.add(config, {
  'email': 'adam@smith.com',
  'custom': [
    {'type': 'Integer', 'key': 'age', 'value': 8}
  ]
});
ChartMogul.CustomAttribute.update(config, customerUuid, {
  'custom': {
    'age': 20,
    'channel': 'Twitter'
  }
});
ChartMogul.CustomAttribute.remove(config, customerUuid, {
  'custom': ['CAC']
});
```


### [Metrics API](https://dev.chartmogul.com/docs/introduction-metrics-api)

Available methods in Metrics API:


```js
ChartMogul.Metrics.all(config, {
  'start-date': '2015-01-01',
  'end-date': '2015-11-24',
  'interval': 'month',
  'geo': 'GB',
  'plans': 'Bronze Plan'
})
ChartMogul.Metrics.mrr(config, query)
ChartMogul.Metrics.arr(config, query)
ChartMogul.Metrics.arpa(config, query)
ChartMogul.Metrics.asp(config, query)
ChartMogul.Metrics.customerCount(config, query)
ChartMogul.Metrics.customerChurnRate(config, query)
ChartMogul.Metrics.mrrChurnRate(config, query)
ChartMogul.Metrics.ltv(config, query)
ChartMogul.Metrics.Customer.activities(config, customerUuid, query)
ChartMogul.Metrics.Customer.subscriptions(config, customerUuid, query)
```


### Errors

The library throws following error objects.

- `ChartMogul.ChartMogulError`
- `ChartMogul.ConfigurationError`
- `ChartMogul.ForbiddenError`
- `ChartMogul.NotFoundError`
- `ChartMogul.ResourceInvalidError`
- `ChartMogul.SchemaInvalidError`

The following table describes the properties of the error object.

|  Property  |       Type       |                             Description                             |
|:----------:|:----------------:|:-------------------------------------------------------------------:|
| `message`  | string           | The error message                                                   |
| `httpStatus`     | number           | When the error occurs during an HTTP request, the HTTP status code. |
| `response` | object or string | HTTP response as JSON, or raw response if not parsable to JSON |

### Rate Limits & Exponential Backoff

The library will keep retrying if the request exceeds the rate limit or if there's any network related error.
By default, the request will be retried for 20 times (approximated 15 minutes) before finally giving up.

You can change the retry count using `Config` object:

```js
const ChartMogul = require('chartmogul-node');
const config = new ChartMogul.Config(process.env.CHARTMOGUL_ACCOUNT_TOKEN, process.env.CHARTMOGUL_SECRET_KEY);
config.retries = 15; // 0 disables retrying
```

## Development

To work on the library:

* Fork it
* Create your feature branch (`git checkout -b my-new-feature`)
* Install dependencies: `npm install`
* Fix bugs or add features. Make sure the changes pass the coding guidelines by runing: `npm run lint`
* Write tests for your new features. For HTTP mocking `nock` library is used. Run tests with `npm test` and check test coverage with `npm run cover`
* If all tests are passed, push to the branch (`git push origin my-new-feature`)
* Create a new Pull Request

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/chartmogul/chartmogul-node.

## Releasing
1. You need an authorized account on npmjs.com
2. Bump up the version in `package.json` & tag on GitHub
3. `npm test`
4. `npm publish`

[Full Howto](https://docs.npmjs.com/getting-started/publishing-npm-packages)

## License

The library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

### The MIT License (MIT)

*Copyright (c) 2016 ChartMogul Ltd.*

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
