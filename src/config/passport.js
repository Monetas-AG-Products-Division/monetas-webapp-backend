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

  passport.use(new FacebookStrategy(policy, function(accessToken, refreshToken, profile, cb) {
    var User = mongoose.model('User');
    User.findOne({username: profile.id}, function(err, user) {
      if (err) {
        return cb(err);
      };

      if (user) {
        return cb(err, result);
      };

      // create a user a new user
      console.log(profile, profile._json);
      var newUser = {
        username: 'facebook-'+profile.id,
        password: accessToken,
        from: 'facebook',
        info: {
          name: profile.name.givenName + ' ' + profile.name.familyName
        },
        email: profile.emails ? profile.emails[0].value : ''
      };

      console.log(newUser);

      // try to create a goatD wallet
      User.createNewAccount(newUser, function(err, result) {
        console.log(err, result);
        return cb(err, result);
      });
    });
  }));
}
