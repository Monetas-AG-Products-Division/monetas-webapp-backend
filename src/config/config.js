var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

var config = {
  development: {
    db: process.env.MONGODB || 'localhost:27017/monetas',
    port: process.env.PORT || 3000,
    root: rootPath
  },
  staging: {
    db: process.env.MONGODB || 'dbuser:monetaspassword@ds019634.mlab.com:19634/monetas-staging',
    port: process.env.PORT || 3000,
    root: rootPath
  },
  production: {
    db: process.env.MONGODB || 'localhost:27017/monetas',
    port: process.env.PORT || 3000,
    root: rootPath
  },
};

module.exports = config[process.env.NODE_ENV || 'development'];
