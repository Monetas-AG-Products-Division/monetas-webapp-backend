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

  // try to create a goatD wallet
  createNewWallet(function(err, wallet) {
    if (err || !wallet) {
      res.status(400).json({error: 'A wallet couldn\'t be created'});
      return;
    };

    newUser.wallet = wallet;

    // get nym-id and save it into db record
    var GoatD = new (require('utils/goatd'))(wallet);
    GoatD.call({action: 'nym-id'}, function (err, response, body) {
      if (err || response.statusCode !== 200) {
        res.status(400).json({error: err});
        return;
      };
      
      newUser.wallet.nym_id = body.trim().replace(/\"/g,'');

      // get allowed units for user's wallet
      GoatD.call({action: 'units'}, function (err, response, body) {
        if (err || response.statusCode !== 200) {
          res.status(400).json({error: err});
          return;
        };

        var units = JSON.parse(body);
        newUser.units = [];
        for (var id in units) {
          newUser.units.push({
            code: units[key].code,
            id: id,
            name: units[key].name
          })
        };

        // save user to database
        User.create(newUser, function(err, result) {
          if (err) {
            res.status(400).json({error: err});
            return;
          };

          // The profile is sending inside the token
          var token = jwt.sign({username: req.body.username, id: result._id}, config.secret.phrase, { expiresIn: config.secret.expiresIn });

          res.json({ token: token });
        });
      });
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
    var token = jwt.sign({username: req.body.username, id: user._id, info: user.info, wallet: user.wallet}, config.secret.phrase, { expiresIn: config.secret.expiresIn });

    res.json({ token: token });

  });
})

function createNewWallet(cb) {
  childProcess.execFile('sudo newwallet', [''], function(err, stdout, stderr) {
    //console.log(err, stdout, stderr);
    var wallet = null;
    if (!err) {
      wallet = {
        db_schema: stdout.match(/DB schema:(.*)\n/)[1].trim(),
        service: stdout.match(/Wallet service:(.*)\n/)[1].trim(),
        sk: stdout.match(/Wallet SK:(.*)\n/)[1].trim(),
        ident: stdout.match(/Wallet ident:(.*)\n/)[1].trim(),
        port: stdout.match(/Wallet port:(.*)\n/)[1].trim()
      };
    };
    cb(err, wallet);
  });
};

