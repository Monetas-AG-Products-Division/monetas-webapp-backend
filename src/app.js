var express = require('express');
var config = require('./config/config');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var glob = require('glob');

// Connect to DB
mongoose.connect(config.db);
mongoose.Promise = Promise;

var db = mongoose.connection;

db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

db.once('open', function() {
  console.log('MongoDB is connected ' + config.db); 
})

// Import models
var models = glob.sync(config.root + '/models/*.js');
models.forEach(function (model) {
  require(model);
});

// Initialize Express app
var app = express();
require('./config/express')(app, config);

// Run server
app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port); 
});

// Passport Auth config
require('./config/passport')();
