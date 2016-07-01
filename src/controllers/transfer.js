var express = require('express');
var router = express.Router();

module.exports = function route(app) {
  app.use('/transfers', router);
};

/**
  @api {post} /transfers 
  @apiName CreateTransfer
  @apiGroup Transfer *
  @apiParam {Object}
  @apiSuccess {String} result.
*/

router.post('/', function (req, res) {
  res.json({result: {status: 'completed'}});
})

/**
  @api {get} /transfers 
  @apiName GetTransfers
  @apiGroup Transfer *
  @apiParam {String}
  @apiSuccess {Array} of transactions.
*/

router.get('/', function (req, res) {
  res.json({result: [{created_at: '02 August 2016', amount: 12, recipient: 'John123'}]});
})

/**
  @api {get} /transfers/:id
  @apiName GetTransfer
  @apiGroup Transfer *
  @apiParam {String}
  @apiSuccess {Object} transaction.
*/

router.get('/:id', function (req, res) {
  res.json({result: {created_at: '02 August 2016', amount: 12, recipient: 'John123'}});
})
