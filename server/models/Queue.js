const mongoose = require('mongoose');
const shortid = require('shortid');

const QueueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  code: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  serviceTime: {
    type: Number,
    required: true,
    default: 5 // minutes
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  currentNumber: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Queue', QueueSchema);
