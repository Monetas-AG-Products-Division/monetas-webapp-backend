var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var config = require('config/config');
var jwt = require('jsonwebtoken');

module.exports = function route(app) {
  app.use('/api/users', router);
};


/**
  @api {put} /api/users 
  @apiName EditUserInfo
  @apiGroup User *
  @apiParam {Object}
  @apiSuccess {Object} updated account.
*/

router.put('/', function (req, res) {
  User.findOne({_id:req.user.id}, function (err, doc) {
    if (err || !doc) {
      res.status(400).json({error: err});
      return;
    }

    // should be changed for future logic
    doc.info = req.body.info || doc.info;
    doc.save(function() {
      var token = jwt.sign({username: doc.username, id: doc._id, wallet: doc.wallet}, config.secret.phrase, { expiresIn: config.secret.expiresIn });
      res.json({ token: token, profile: {info: doc.info, nym_id: doc.wallet.nym_id, units: doc.units, _id: doc._id} });
    });
  });

})

/**
  @api {get} /api/users/profile 
  @apiName GetUserProfile
  @apiGroup Profile *
  @apiParam {String}
  @apiSuccess {Object} profile.
*/

router.get('/profile', function (req, res) {
  User.findOne({_id:req.user.id}, function (err, doc) {
    if (err || !doc) {
      res.status(400).json({error: err});
      return;
    }

    res.json({result: {info: doc.info, wallet: doc.wallet} });
  });
})

/**
  @api {get} /api/users/balance 
  @apiName GetUserBalance
  @apiGroup Balance *
  @apiParam {String}
  @apiSuccess {Object} balance.
*/

router.get('/balance', function (req, res) {
  var GoatD = new (require('utils/goatd'))(req.user.wallet);
  GoatD.call({action: 'balance'}, function (err, response, body) {
    if (err || response.statusCode !== 200) {
      res.status(400).json({error: err});
      return;
    };

    var body = JSON.parse(body);

    var balance = {};

    User.findOne({_id: req.user.id}, function (err, profile) {
      if (err || !profile) {
        res.status(400).json({error: err});
        return;
      };

      for (var key in body) {
        var idx = profile.units.map(function(e) { return e.id; }).indexOf(key);
        if (idx != -1) {
          balance[profile.units[idx].name] = body[key];
        };
      };
      res.json({result: balance});      
    });

  });  
})
