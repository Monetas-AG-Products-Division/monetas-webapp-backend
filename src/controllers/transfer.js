var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Transfer = mongoose.model('Transfer');
var User = mongoose.model('User');

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

router.post('/income', function (req, res) {
  var newTransfer = {
    amount: req.body.amount, 
    fee: req.body.fee,
    message: req.body.message || '',
    recipient: req.user.id,
    unit: req.body.unit,
    status: 'pending'
  };
  
  Transfer.create(newTransfer, function(err, result) {
    if (err) {
      res.status(400).json({error: err});
      return;
    };

    res.json(result);
  });
})

router.post('/outcome', function (req, res) {
  var newTransfer = {
    amount: req.body.amount, 
    fee: req.body.fee,
    message: req.body.message || '',
    recipient: req.body.recipient,
    sender: req.user.id,
    unit: req.body.unit
  };


  User.findOne({_id: req.body.recipient}, function (err, recipientProfile) {
    if (err || !recipientProfile) {
      res.status(400).json({error: err});
      return;
    };

    var stransfer = {};
    stransfer[recipientProfile.wallet.nym_id] = {};
    stransfer[recipientProfile.wallet.nym_id][newTransfer.unit] = parseFloat(newTransfer.amount);

    var GoatD = new (require('utils/goatd'))(req.user.wallet);
    GoatD.call({action: 'transfers', method: 'POST', body: stransfer}, function (err, response, body) {

      if (response.statusCode !== 302 && !body) {
        res.status(400).json({error: err, response: response});
        return;
      };

      var status = 'completed';
      var error = null;
      if (response.statusCode !== 302) {
        status = 'uncompleted';
        error = body.code;
      };

      newTransfer.status = status;

      Transfer.create(newTransfer, function(err, newRecord) {
        if (err) {
          res.status(400).json({error: err});
          return;
        };
        res.json({result: newRecord, error: error});
      });

    });

  });

  /*
  */
  
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
  @api {delete} /transfers 
  @apiName PutTransfer
  @apiGroup Transfer *
  @apiParam {Object}
  @apiSuccess {String} deleted record.
*/

router.put('/complete/:id', function (req, res) {
  
  Transfer.findOne({_id: req.params.id, status: 'pending'}, function (err, doc) {
    if (err || !doc) {
      res.status(400).json({error: err});
      return;
    }

    var stransfer = {};
    stransfer[doc.recipient.wallet.nym_id] = {};
    stransfer[doc.recipient.wallet.nym_id][doc.unit] = parseFloat(doc.amount);

    var GoatD = new (require('utils/goatd'))(req.user.wallet);
    GoatD.call({action: 'transfers', method: 'POST', body: stransfer}, function (err, response, body) {

      if (response.statusCode !== 302 && !body) {
        res.status(400).json({error: err, response: response});
        return;
      };

      var status = 'completed';
      var error = null;
      if (response.statusCode !== 302) {
        status = 'uncompleted';
        error = body.code;
      };

      newTransfer.status = status;

      Transfer.update({_id:doc._id}, {sender: req.user.id, status: status, historyId: 1}, function(err, updatedRecord) {
        if (err) {
          res.status(400).json({error: err});
          return;
        };

        res.json({result: updatedRecord, error: error});
      });

    });

  }).populate('recipient');

})

/**
  @api {get} /transfers 
  @apiName GetTransfers
  @apiGroup Transfer *
  @apiParam {String}
  @apiSuccess {Array} of transactions.
*/

router.get('/', function (req, res) {
  Transfer.find({status: {$ne: 'deleted'}, $and: [
    { $or: [{sender: req.user.id},{recipient: req.user.id}] }
  ]}, function(err, result) {
    if (err) {
      res.status(400).json({error: err});
      return;
    };

    result.forEach(function(item, key) {
      var units = [];
      if (item.sender && item.sender._id == req.user.id) {
        result[key].type = 'outcome';
        units = result[key].sender.units;
      };

      if (item.recipient && item.recipient._id == req.user.id) {
        result[key].type = 'income';
        units = result[key].recipient.units;
      };

      units.forEach(function(unit) {
        if (unit.id == result[key].unit) {
          result[key].unitName = unit.name;
        }
      });
    });

    result.forEach(function(item, key) {
      if (result[key].sender) delete result[key].sender.units;        
      if (result[key].recipient) delete result[key].recipient.units;        
    });

    res.json({result: result});
  }).lean().populate('recipient', 'info.name wallet.nym_id units').populate({path: 'sender', select: 'info.name wallet.nym_id units'});
})

/**
  @api {get} /transfers/:id
  @apiName GetTransfer
  @apiGroup Transfer *
  @apiParam {String}
  @apiSuccess {Object} transaction.
*/

router.get('/:id', function (req, res) {
  Transfer.findOne({_id: req.params.id, status: {$ne: 'deleted'}}, function(err, result) {
    if (err || !result) {
      res.status(400).json({error: err});
      return;
    };

    var units = [];

    if (result.sender) {
      units = result.sender.units;
    };

    if (result.recipient) {
      units = result.recipient.units;
    };

    units.forEach(function(unit) {
      if (unit.id == result.unit) {
        result.unitName = unit.name;
      }
    });

    if (result.sender) delete result.sender.units;        
    if (result.recipient) delete result.recipient.units;        

    res.json({result: result});
  }).lean().populate('recipient', 'info.name wallet.nym_id units').populate({path: 'sender', select: 'info.name wallet.nym_id units'});
})

router.get('/fees', function (req, res) {
  var newTransfer = {
    amount: req.body.amount,
    unit: req.body.unit
  };
  
  GoatD.call({action: 'fees', method: 'GET', query: 'amount='+newTransfer.amount+'&unitID='+newTransfer.unit}, function (err, response, body) {
    if (response.statusCode !== 302 && !body) {
      res.status(400).json({error: err, response: response});
      return;
    };
    res.json({result: body});
  });
})
