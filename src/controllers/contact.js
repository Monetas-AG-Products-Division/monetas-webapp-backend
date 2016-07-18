var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Contact = mongoose.model('Contact');

module.exports = function route(app) {
  app.use('/api/contacts', router);
};

/**
  @api {post} /contacts 
  @apiName CreateContact
  @apiGroup Contact *
  @apiParam {Object}
  @apiSuccess {String} result.
*/

router.post('/', function (req, res) {
  var newContact = {
    user: req.body.user,
    owner: req.user.id,
    status: 'active'
  };

  Contact.findOne({owner:req.user.id, user: newContact.user}, function(err, result) {
    if (err) {
      res.status(400).json({error: err});
      return;
    };

    if (result) {
      res.status(400).json({error: 'User exists as contact'});
      return;
    };

    Contact.create(newContact, function(err, result) {
      if (err) {
        res.status(400).json({error: err});
        return;
      };

      res.json({ result: result });
    });

  });
})

/**
  @api {delete} /contacts 
  @apiName DeleteContact
  @apiGroup Contact *
  @apiParam {Object}
  @apiSuccess {String} deleted record.
*/

router.delete('/:id', function (req, res) {
  Contact.findOne({owner:req.user.id, user: req.params.id}, function (err, doc) {
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
  @api {get} /contacts 
  @apiName GetContacts
  @apiGroup Contact *
  @apiParam {String}
  @apiSuccess {Array} of contacts.
*/

router.get('/', function (req, res) {
  Contact.find({owner:req.user.id}, function(err, result) {
    if (err) {
      res.status(400).json({error: err});
      return;
    };

    res.json({result: result});
  });
})

/**
  @api {get} /contacts/:id
  @apiName GetContact
  @apiGroup Contact *
  @apiParam {String}
  @apiSuccess {Object} contact.
*/

router.get('/:id', function (req, res) {
  Contact.findOne({owner:req.user.id, user: req.params.id}, function(err, result) {
    if (err) {
      res.status(400).json({error: err});
      return;
    };

    res.json({result: result});
  });
})
