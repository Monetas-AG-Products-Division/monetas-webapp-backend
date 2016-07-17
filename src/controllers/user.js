var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

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
      res.json({result: doc});
    });
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
  // here should be the request to GoatD instance to get real value
  res.json({result: {amount: 2400, currency: 'USD'}});
})
