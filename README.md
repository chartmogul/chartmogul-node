# chartmogul-js
Official Chartmogul API JavaScript Client


## Usage

```js
const ChartMogul = require('./lib/chartmogul');

const config = new ChartMogul.Config('token', 'secret');

ChartMogul.Import.Customer.all(config, {
  page: 1
}).then(customers => {
  console.log(customers);
}).catch(e => console.error(e));

```

Output

```js
{ customers: 
   [ { uuid: 'cus_7e4e5c3d-832c-4fa4-bf77-6fdc8c6e14bc',
       external_id: 'cus_0001',
       name: 'Adam Smith',
       company: '',
       email: 'adam@smith.com',
       city: 'New York',
       state: '',
       country: 'US',
       zip: '',
       data_source_uuid: 'ds_e243129a-12c0-4e29-8f54-07da7905fbd1' } ],
  current_page: 1,
  total_pages: 1 }
```

