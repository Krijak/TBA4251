// var cool = require('cool-ascii-faces');
var express = require('express');
// var connect = require('connect');
var fs = require('fs');
var mongoose = require('mongoose');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var turf = require('@turf/turf');
// var router = app.Router();



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
// app.use('/api', router);
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true, parameterLimit:50000}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});


// app.get('/cool', function(request, response) {
//   response.send(cool());
// });

app.get('/api/buffer', function(request, response) {
  response.json({message: 'API!!'});
  // console.log('halllaien');
});

app.post('/api/buffer', function(request,response){
	result = turf.buffer(request.body.layer, request.body.dist, 'kilometers');
	response.send(result);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// Connection URL 
var url = 'mongodb://heroku_k7jjmzwc:idaj27pbptblpb7f1nh3oiiqu9@ds139327.mlab.com:39327/heroku_k7jjmzwc';

mongoose.connect(url);
mongoose.connection.on('connected', function () {  
  console.log('connected correctly to server');
});

//load all files in models dir
// fs.readdirSync(__dirname + '/models').forEach(function(filename) {
//   if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
// });

// app.get('/users', function(req, res) {
//   mongoose.model('users').find(function(err, users) {
//     res.send(users);
//   });
// });