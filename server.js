var express = require('express');
const app = express();
var _ = require('lodash');
var bodyParser = require('body-parser');


var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'keyc1rvSQz8HDN9rU' }).base('appEhDJ5yusT5vDou');

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser());


app.get('/', (req, res) => {
  console.log('starting');
  res.send('👋🏼  🌎');
})

app.get('/list', (req, res) => {
  let items = [];
  base('list').select({
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
    const result = records.map((item) => {
      items.push(item.get('Name'));
    });

    fetchNextPage();

  }, function done(err) {
    if (err) { console.error(err); return; }
    res.send(items);
  });
})

app.get('/list/:query', (req, res) => {
  let items = [];
  base('list').select({
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
    const result = records.map((item) => {
      items.push(item.get('Name'));
    });

    fetchNextPage();

  }, function done(err) {
    if (err) { console.error(err); return; }
    let filteredItems = items;
    if (req.params.query) {
      console.log(req.params.query);
      filteredItems = items.filter(item => {
        return item.toLowerCase().includes(req.params.query.toLowerCase());
      })
    }
    res.send(filteredItems);
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

app.post('/match', (req, res) => {
  let matchItems = req.body.items;
  let allItems = [];
  base('list').select({
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
    fetchNextPage();
    records.map(item => {
      // console.log(item);
      allItems.push(item);
    });

  }, function done(err) {
    if (err) { console.error(err); return; }
    console.log(allItems);
    const matchingItems = allItems.filter(item => matchItems.includes(item.get("Name")))
      .map(item => item.id)
    res.send(matchingItems);
  });
})

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})
