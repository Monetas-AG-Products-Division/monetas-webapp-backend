var express = require('express');
var glob = require('glob');
var bodyParser = require('body-parser');
var cors = require('cors');

module.exports = function(app, config) {
  /*
  var whitelist = ['http://localhost:3000'];
  var corsOptions = {
    origin: function(origin, callback){
      var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    }
  };

  app.use(cors(corsOptions));
  */
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // Setup controllers
  var controllers = glob.sync(config.root + '/controllers/**/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });
};
