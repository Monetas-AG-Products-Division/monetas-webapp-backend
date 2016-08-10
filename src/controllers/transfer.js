var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Transfer = mongoose.model('Transfer');

module.exports = function route(app) {
  app.use('/api/transfers', router);
};

/**
  @api {post} /transfers 
  @apiName CreateTransfer
  @apiGroup Transfer *
  @apiParam {Object}
  @apiSuccess {String} result.
*/

router.post('/', function (req, res) {
  var newTransfer = {
    amount: req.body.amount, 
    fee: req.body.fee,
    message: req.body.message || '',
    //recipient: req.body.recipient,
    sender: req.user.id,
    unit: req.body.unit,
    status: 'pending'
  };

  console.log(newTransfer);
  console.log(req.user);

  var stransfer = {};
  stransfer[req.user.wallet.nym_id] = req.body.recipient;

  /*
  var GoatD = new (require('utils/goatd'))(req.user.wallet);
  GoatD.call({action: 'balance', method: 'POST', body: stransfer}, function (err, response, body) {

    // successful transaction 
    if (response.statusCode === 302) {
      
    }
    if (body) body = JSON.parse(body);

    if (!body) {
      res.status(400).json({error: err});
      return;
    };


    var answer = JSON.parse(body);
  });
  */
  
  Transfer.create(newTransfer, function(err, result) {
    if (err) {
      res.status(400).json({error: err});
      return;
    };

    res.json(result);
  });
})

/**
  @api {delete} /transfers 
  @apiName DeleteTransfer
  @apiGroup Transfer *
  @apiParam {Object}
  @apiSuccess {String} deleted record.
*/

router.delete('/:id', function (req, res) {
  
  Transfer.findOne({sender:req.user.id, _id: req.params.id}, function (err, doc) {
    if (err || !doc) {
      res.status(400).json({error: err});
      return;
    }

    doc.status = 'deleted';
    doc.save(function() {
      res.json({result: doc});
    });
  });

})

/**
  @api {get} /transfers 
  @apiName GetTransfers
  @apiGroup Transfer *
  @apiParam {String}
  @apiSuccess {Array} of transactions.
*/

router.get('/', function (req, res) {
  Transfer.find({$and: [
    { $or: [{sender: req.user.id}] },
    { $or: [{recipient: req.user.id}] }
  ]}, function(err, result) {
    if (err) {
      res.status(400).json({error: err});
      return;
    };

    result.forEach(function(item, key) {
      result[key].sender.units.forEach(function(unit) {
        if (unit.id == result.unit) {
          result[key].unitName = unit.name;
        }
      });
      delete result[key].sender.units;

    });



    res.json({result: result});
  }).lean().populate('recipient', 'info.name wallet.nym_id').populate({path: 'sender', select: 'info.name wallet.nym_id units'});
})

/**
  @api {get} /transfers/:id
  @apiName GetTransfer
  @apiGroup Transfer *
  @apiParam {String}
  @apiSuccess {Object} transaction.
*/

router.get('/:id', function (req, res) {
  Transfer.findOne({_id: req.params.id}, function(err, result) {
    if (err || !result) {
      res.status(400).json({error: err});
      return;
    };
    result.sender.units.forEach(function(unit) {
      if (unit.id == result.unit) {
        result.unitName = unit.name;
      }
    });
    delete result.sender.units;

    res.json({result: result});
  }).lean().populate('recipient', 'info.name wallet.nym_id').populate({path: 'sender', select: 'info.name wallet.nym_id units'});
})
