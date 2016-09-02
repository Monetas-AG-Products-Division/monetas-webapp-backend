var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var config = require('./config');
var mongoose = require('mongoose');

module.exports = function() {
  var policy = {
    clientID: config.facebook.appId,
    clientSecret: config.facebook.appSecret,
    callbackURL: config.facebook.redirectUrl,
    profileFields: ['id', 'displayName', 'email']
  };
  console.log(policy);

  passport.use(new FacebookStrategy(policy,
    function(accessToken, refreshToken, profile, cb) {
      var User = mongoose.model('User');

      // create a user a new user
      var newUser = {
        username: profile._json.email,
        password: profile._json.id,
        from: 'facebook'
      };

      console.log(newUser);

      // try to create a goatD wallet
      User.createNewAccount(newUser, function(err, result) {
        return cb(err, result);
      });
    }
  ));
}
