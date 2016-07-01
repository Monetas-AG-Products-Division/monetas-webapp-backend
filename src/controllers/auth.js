var express = require('express');
var router = express.Router();

module.exports = function route(app) {
  app.use('/auth', router);
};

/**
  @api {post} /auth/login login and password
  @apiName LoginAuth
  @apiGroup Auth *
  @apiParam {Object}
  @apiSuccess {String} new token.
*/

router.post('/login', function (req, res) {
  res.json({result: {token: '3l3129u312ljlkejaosid2oine12e21oiie'}});
})
