const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Your React app URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('joinQueue', (queueId) => {
    socket.join(`queue_${queueId}`);
    console.log(`Client joined queue: ${queueId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/queues', require('./routes/queues'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
