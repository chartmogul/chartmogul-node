<p align="center">
<a href="https://chartmogul.com"><img width="200" src="https://chartmogul.com/assets/img/logo.png"></a>
</p>

<h3 align="center">Official Chartmogul API Node.js Client</h3>

<p align="center"><code>chartmogul-node</code> provides convenient Node.js bindings for <a href="https://dev.chartmogul.com">ChartMogul's API</a>.</p>

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

```js
npm install --save chartmogul-node
```

## Configuration

First create a `Config` object by passing your account token and secret key, available from the administration section of your ChartMogul account.

```js
const ChartMogul = require('chartmogul-node');
const config = new ChartMogul.Config(process.env.CHARTMOGUL_ACCOUNT_TOKEN, process.env.CHARTMOGUL_SECRET_KEY);
```

You need to pass this config object as the first argument to each request.

## Usage

The library can be used both with promise and callback patterns. Supply the callback function as the last argmunent.

Here is are complete examples:

**Using as promise**

```js
const ChartMogul = require('chartmogul-node');

const config = new ChartMogul.Config('accountToken', 'secretKey');

ChartMogul.Import.Customer.create(config, data)
.then(res => {
  console.log(res);
})
.catch(e => console.error(e.message, .httpStatus, e.response));

```

**Using with a callback**

```js
const ChartMogul = require('chartmogul-node');

const config = new ChartMogul.Config('accountToken', 'secretKey');

ChartMogul.Import.Customer.create(config, data, (err, res) => {
  if(err){
    console.error(e.message, .httpStatus, e.response)
  }
  console.log(res);
});
```

### Import API

Available methods in Import API:

#### Data Source

```js
ChartMogul.Import.DataSource.create(config, data);
```
```js
ChartMogul.Import.DataSource.all(config, query);
```
```js
ChartMogul.Import.DataSource.delete(config, dataSourceId);
```