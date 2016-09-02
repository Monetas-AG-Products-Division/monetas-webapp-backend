var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var secret = '*(@!9kdj20`UK';
var secretExpiresInSeconds = 60*60*5; // 5 hours

var config = {
  development: {
    db: process.env.MONGODB || 'localhost:27017/monetas',
    port: process.env.PORT || 3000,
    root: rootPath,
    secret: {
      phrase: secret,
      expiresIn: secretExpiresInSeconds
    },
    goatD: {
      server: '127.0.0.1',
      version: 'v4.0'
    },
    facebook: {
      appId: '1059174770845845',
      appSecret: '17faa1bd42e045ef8d4da26c1305fd86',
      redirectUrl: 'http://localhost:3000/auth/facebook/callback',
      profileUrl: 'https://graph.facebook.com/v2.2/me'
    },
    google: {
      clientId: '247686357136-26vul8asqdoc9jtq97238cgv8kcs8m3b.apps.googleusercontent.com',
      profileUrl: 'https://www.googleapis.com/plus/v1/people/me'
    },
    android: {
      key: 'AIzaSyC61i7tA_Vuya9xvHEZXvBH8lPoBuZbV78'
    }
  },
  staging: {
    db: process.env.MONGODB || 'dbuser:monetaspassword@ds019634.mlab.com:19634/monetas-staging',
    port: process.env.PORT || 3000,
    root: rootPath,
    secret: {
      phrase: secret,
      expiresIn: secretExpiresInSeconds
    },
    goatD: {
      server: '127.0.0.1',
      version: 'v4.0'
    },
    facebook: {
      appId: '657500347745694',
      appSecret: 'c5d555d1e2fb97727825c228b9c5cad1',
      redirectUrl: 'http://api.monetas.net/auth/facebook/callback',
      profileUrl: 'https://graph.facebook.com/v2.2/me'
    },
    google: {
      clientId: '247686357136-26vul8asqdoc9jtq97238cgv8kcs8m3b.apps.googleusercontent.com',
      profileUrl: 'https://www.googleapis.com/plus/v1/people/me'
    },
    android: {
      key: 'AIzaSyC61i7tA_Vuya9xvHEZXvBH8lPoBuZbV78'
    }
  },
  production: {
    db: process.env.MONGODB || 'dbuser:monetaspassword@ds019634.mlab.com:19634/monetas-staging',
    port: process.env.PORT || 3000,
    root: rootPath,
    secret: {
      phrase: secret,
      expiresIn: secretExpiresInSeconds
    },
    goatD: {
      server: '127.0.0.1',
      version: 'v4.0'
    },
    facebook: {
      appId: '667202340098837',
      appSecret: '77e6728542e6a3d1ffb264436e4a5635',
      redirectUrl: 'http://api.monetas.net/auth/facebook/callback',
      profileUrl: 'https://graph.facebook.com/v2.2/me'
    },
    google: {
      clientId: '247686357136-26vul8asqdoc9jtq97238cgv8kcs8m3b.apps.googleusercontent.com',
      profileUrl: 'https://www.googleapis.com/plus/v1/people/me'
    },
    android: {
      key: 'AIzaSyC61i7tA_Vuya9xvHEZXvBH8lPoBuZbV78'
    }
  },
};

module.exports = config[process.env.NODE_ENV || 'development'];
