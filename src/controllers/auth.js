var express = require('express');
var config = require('config/config');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var path = require('path');
var childProcess = require('child_process');


module.exports = function route(app) {
  app.use('/auth', router);
};

/**
  @api {post} /auth/signup login and password
  @apiName SignupAuth
  @apiGroup Auth *
  @apiParam {Object}
  @apiSuccess {String} new token.
*/

router.post('/signup', function (req, res) {
  // create a user a new user
  var newUser ={
    username: req.body.username,
    password: req.body.password
  };

  // save user to database
  User.create(newUser, function(err, result) {
    if (err) {
      res.status(400).json({error: err});
      return;
    };

    // The profile is sending inside the token
    var token = jwt.sign({username: req.body.username, id: result._id}, config.secret.phrase, { expiresIn: config.secret.expiresIn });

    var params = [];
    createNewWallet(params, function(err, result) {
      console.log(err, result);
      res.json({ token: token });
    });


  });

})

/**
  @api {post} /auth/login login and password
  @apiName LoginAuth
  @apiGroup Auth *
  @apiParam {Object}
  @apiSuccess {String} new token.
*/

router.post('/login', function (req, res) {
  User.getAuthenticated(req.body.username, req.body.password, function(err, user, reason) {
    if (err) {
      res.status(400).json({error: err});
      return;
    };

    if (!user) {
      var reasons = User.failedLogin;
      var errorDescription = '';
      switch (reason) {
        case reasons.NOT_FOUND:
        case reasons.PASSWORD_INCORRECT:
          // note: these cases are usually treated the same - don't tell
          // the user *why* the login failed, only that it did
          errorDescription = 'User were not found';
          break;
        case reasons.MAX_ATTEMPTS:
          // send email or otherwise notify user that account is
          // temporarily locked
          errorDescription = 'Account is temporarily locked';
          break;
      };
      res.status(401).json({error: errorDescription});
      return;
    };

    // The profile is sending inside the token
    var token = jwt.sign({username: req.body.username, id: user._id, info: user.info}, config.secret.phrase, { expiresIn: config.secret.expiresIn });

    res.json({ token: token });

  });
})

function createNewWallet(params, cb) {
  var childArgs = [ 'newwallet' ].concat(params);

  childProcess.execFile('', childArgs, function(err, stdout, stderr) {
    //console.log(err, stdout, stderr);
    cb(err, stdout.replace(/(\r\n|\n|\r)/gm,''));
  });
};

