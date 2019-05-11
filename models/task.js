var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
  },
  description: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  priority: {
    type: Number
  },
  complete: {
    type: Boolean, 
    default: false
  }
});

var Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
