// Load required packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define our transfer schema
var Contact = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: String,
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

Contact.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

// Export the Mongoose model
module.exports = mongoose.model('Contact', Contact);
