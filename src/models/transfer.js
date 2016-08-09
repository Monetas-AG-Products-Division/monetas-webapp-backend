// Load required packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define our transfer schema
var Transfer = new Schema({
  amount: {type: Number, required: true},
  message: String,
  recipient: { type: Schema.Types.ObjectId, ref: 'User'},
  sender: { type: Schema.Types.ObjectId, ref: 'User'},
  unit: {type: String, required: true },
  status: String,
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

Transfer.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

// Export the Mongoose model
module.exports = mongoose.model('Transfer', Transfer);
