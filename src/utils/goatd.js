'use strict'

var request = require('request');
var config = require('config/config');

/**
  How to use:
  var GoatD = new (require('utils/goatd'));
*/

module.exports = class S3Utils {

  constructor(wallet) {
    this.uri = 'http://' + config.goatD.server + ':' + wallet.port + '/' + config.goatD.version + '/';
  }

  call(params, cb) {
    var options = {
      url: this.uri + params.action,
      method: params.method || 'GET'
    };

    if (params.body) options.json = params.body;

    request(options, function (err, response, body) {
      cb(err, response, body);
    })
  }
}
