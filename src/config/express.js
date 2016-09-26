var express = require('express');
var glob = require('glob');
var bodyParser = require('body-parser');
var cors = require('cors');
var expressJwt = require('express-jwt');
var config = require('config/config');

module.exports = function(app, config) {
  /*
  var whitelist = ['http://localhost:3000'];
  var corsOptions = {
    origin: function(origin, callback){
      var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    }
  };
  corsOptions
  */
  app.use(cors());

  // We are going to protect /api routes with JWT
  app.use('/api', expressJwt({ secret: config.secret.phrase }));

  // handle auth errors in a right way
  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({error:'Invalid token'});
    }
  });
  
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
