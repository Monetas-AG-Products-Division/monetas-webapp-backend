var express = require('express');
var router = express.Router();

module.exports = function route(app) {
  app.use('/user', router);
};

/**
  @api {get} /user/balance
  @apiName GetUserBalance
  @apiGroup User *
  @apiParam {}
  @apiSuccess {Object} balance details.
*/

router.get('/balance', function (req, res) {
  res.json({result: {amount: 12}});
})
