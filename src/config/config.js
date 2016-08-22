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
      version: 'v3.0'
    },
    facebook: {
      appId: '1060375004059155',
      profileUrl: 'https://graph.facebook.com/v2.2/me'
    },
    google: {
      clientId: '475026824438-eamepvbka7q0i9r5m9ef5eej3bl1kpos.apps.googleusercontent.com',
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
      version: 'v3.0'
    },
    facebook: {
      appId: '1060375004059155',
      profileUrl: 'https://graph.facebook.com/v2.2/me'
    },
    google: {
      clientId: '475026824438-eamepvbka7q0i9r5m9ef5eej3bl1kpos.apps.googleusercontent.com',
      profileUrl: 'https://www.googleapis.com/plus/v1/people/me'
    },
    android: {
      key: 'AIzaSyC61i7tA_Vuya9xvHEZXvBH8lPoBuZbV78'
    }
  },
  production: {
    db: process.env.MONGODB || 'localhost:27017/monetas',
    port: process.env.PORT || 3000,
    root: rootPath,
    secret: {
      phrase: secret,
      expiresIn: secretExpiresInSeconds
    },
    goatD: {
      server: '127.0.0.1',
      version: 'v3.0'
    },
    facebook: {
      appId: '1060375004059155',
      profileUrl: 'https://graph.facebook.com/v2.2/me'
    },
    google: {
      clientId: '475026824438-eamepvbka7q0i9r5m9ef5eej3bl1kpos.apps.googleusercontent.com',
      profileUrl: 'https://www.googleapis.com/plus/v1/people/me'
    },
    android: {
      key: 'AIzaSyC61i7tA_Vuya9xvHEZXvBH8lPoBuZbV78'
    }
  },
};

module.exports = config[process.env.NODE_ENV || 'development'];
