const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
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
      .sort('-createdAt');
    res.json(queues);
  } catch (error) {
    console.error('Error fetching queues:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get queue by code
router.get('/:code', async (req, res) => {
  try {
    const queue = await Queue.findOne({ code: req.params.code });
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    res.json(queue);
  } catch (error) {
    console.error('Error fetching queue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
