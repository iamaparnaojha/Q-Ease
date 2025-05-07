const mongoose = require('mongoose');
const shortid = require('shortid');

const ParticipantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'processing', 'completed'],
    default: 'waiting'
  },
  number: {
    type: Number,
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  estimatedStartTime: {
    type: Date
  }
});

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
  },
  participants: [ParticipantSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Queue', QueueSchema);
