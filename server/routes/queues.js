const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Create a new queue
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, serviceTime } = req.body;

    const queue = new Queue({
      name,
      description,
      serviceTime,
      createdBy: req.user.id
    });

    await queue.save();
    res.status(201).json(queue);
  } catch (error) {
    console.error('Error creating queue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all queues for admin
router.get('/', auth, async (req, res) => {
  try {
    const queues = await Queue.find({ createdBy: req.user.id })
      .populate('participants.user', 'name email')
      .sort('-createdAt');
    res.json(queues);
  } catch (error) {
    console.error('Error fetching queues:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get queues where user is a participant
router.get('/user', auth, async (req, res) => {
  try {
    // Find all queues where the user is a participant
    const queues = await Queue.find({
      'participants.user': req.user.id
    })
    .populate('participants.user', 'name email')
    .sort('-createdAt');

    res.json(queues);
  } catch (error) {
    console.error('Error fetching user queues:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get queue by code
router.get('/:code', async (req, res) => {
  try {
    const queue = await Queue.findOne({ code: req.params.code })
      .populate('participants.user', 'name email');
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    res.json(queue);
  } catch (error) {
    console.error('Error fetching queue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join a queue
router.post('/:id/join', auth, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    // Check if user is already in the queue
    const alreadyJoined = queue.participants.some(
      p => p.user.toString() === req.user.id
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: 'You are already in this queue' });
    }

    // Increment current number and add user to participants
    queue.currentNumber += 1;

    // Calculate estimated start time based on people ahead and service time
    const peopleAhead = queue.participants.filter(p => p.status === 'waiting').length;
    const estimatedWaitTime = peopleAhead * queue.serviceTime * 60 * 1000; // convert to milliseconds
    const estimatedStartTime = new Date(Date.now() + estimatedWaitTime);

    queue.participants.push({
      user: req.user.id,
      number: queue.currentNumber,
      estimatedStartTime
    });

    await queue.save();

    // Notify all clients in this queue room
    const io = req.app.get('io');
    io.to(`queue_${queue._id}`).emit('queueUpdated', queue);

    res.json(queue);
  } catch (error) {
    console.error('Error joining queue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave a queue
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    // Find and remove the user from participants
    const participantIndex = queue.participants.findIndex(
      p => p.user.toString() === req.user.id
    );

    if (participantIndex === -1) {
      return res.status(400).json({ message: 'You are not in this queue' });
    }

    // Remove the participant
    queue.participants.splice(participantIndex, 1);
    await queue.save();

    // Notify all clients in this queue room
    const io = req.app.get('io');
    io.to(`queue_${queue._id}`).emit('queueUpdated', queue);

    res.json({ message: 'Successfully left the queue' });
  } catch (error) {
    console.error('Error leaving queue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update participant status
router.patch('/:queueId/participant/:userId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['waiting', 'processing', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const queue = await Queue.findById(req.params.queueId);
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    // Check if user is the queue creator
    if (queue.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this queue' });
    }

    // Find and update the participant
    const participantIndex = queue.participants.findIndex(
      p => p.user.toString() === req.params.userId
    );

    if (participantIndex === -1) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    queue.participants[participantIndex].status = status;

    // If status changed to processing, update estimated times for waiting participants
    if (status === 'processing') {
      // Update estimated times for all waiting participants
      const waitingParticipants = queue.participants.filter(p => p.status === 'waiting');
      waitingParticipants.forEach((p, index) => {
        const waitTime = index * queue.serviceTime * 60 * 1000;
        p.estimatedStartTime = new Date(Date.now() + waitTime);
      });
    }

    await queue.save();

    // Notify all clients in this queue room
    const io = req.app.get('io');
    io.to(`queue_${queue._id}`).emit('queueUpdated', queue);

    res.json(queue);
  } catch (error) {
    console.error('Error updating participant status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
