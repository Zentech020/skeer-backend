var express = require('express');
const app = express();
var _ = require('lodash');

var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'keyc1rvSQz8HDN9rU' }).base('appEhDJ5yusT5vDou');



app.get('/', (req, res) => {
  res.send('hello 👋🏼');
})

app.get('/list', (req, res) => {
  let items = [];
  base('list').select({
    maxRecords: 10,
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    // const results = records.map((item) => items.push(item.get('Name'))
    const result = records.map((item) => {
      items.push(item.get('Name'));
    });
    res.send(items);

  }, function done(err) {
    if (err) { console.error(err); return; }
  });
})



app.get('/list/:query', (req, res) => {
  let items = [];
  const query = req.params.query;
  base('list').select({
  }).eachPage(function page(records, fetchNextPage) {

    const list = records.filter(record => (record.get('Name') === query));

    res.send(list);


  }, function done(err) {
    if (err) { console.error(err); return; }
  });
})

app.get('/test', (req, res) => {
  if ('Remia' == 'Remia') {
    console.log('true')
  }
  else {
    console.log('false');
  }
})

app.listen(5000, () => {
  console.log('listen to port 5000');
})