var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient, assert = require('assert');


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// Connection URL 
var url = 'mongodb://heroku_k7jjmzwc:idaj27pbptblpb7f1nh3oiiqu9@ds139327.mlab.com:39327/heroku_k7jjmzwc';
// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  db.close();
});