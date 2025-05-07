import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import UserQueueItem from './UserQueueItem';
import { toast } from 'react-toastify';
import { queueService } from '../services/api';

const UserActiveQueues = () => {
  const [activeQueues, setActiveQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    fetchUserQueues();

    // Listen for queue updates
    socket.on('queueUpdated', handleQueueUpdate);

    return () => {
      socket.off('queueUpdated', handleQueueUpdate);
    };
  }, []);

  const fetchUserQueues = async () => {
    try {
      setLoading(true);
      setError('');

      // Get the user's active queues
      const response = await fetch('http://localhost:5000/api/queues/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch queues');
      }

      const allQueues = await response.json();

      // Filter queues where the user is a participant
      const userQueues = allQueues.filter(queue =>
        queue.participants &&
        queue.participants.some(p => p.user._id === user.id)
      );

      setActiveQueues(userQueues);
    } catch (error) {
      console.error('Error fetching user queues:', error);
      setError('Failed to load your active queues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQueueUpdate = (updatedQueue) => {
    setActiveQueues(prevQueues => {
      // Check if this queue is in our active queues
      const index = prevQueues.findIndex(q => q._id === updatedQueue._id);

      // If user is no longer in this queue, remove it
      const userStillInQueue = updatedQueue.participants &&
        updatedQueue.participants.some(p => p.user._id === user.id);

      if (index >= 0) {
        if (!userStillInQueue) {
          // User was removed from the queue
          return prevQueues.filter(q => q._id !== updatedQueue._id);
        }

        // Update the queue
        const newQueues = [...prevQueues];
        newQueues[index] = updatedQueue;
        return newQueues;
      } else if (userStillInQueue) {
        // This is a new queue for the user
        return [...prevQueues, updatedQueue];
      }

      return prevQueues;
    });
  };

  const getUserPosition = (queue) => {
    if (!queue.participants || !user) return 0;

    // Find the user's participant entry
    const userParticipant = queue.participants.find(p => p.user._id === user.id);
    if (!userParticipant) return 0;

    // Count how many participants are ahead (have lower numbers)
    // Only count those who are still waiting or being processed
    const position = queue.participants.filter(p =>
      (p.status === 'waiting' || p.status === 'processing') &&
      p.number <= userParticipant.number
    ).length;

    return position;
  };

  const handleLeaveQueue = async (queueId) => {
    try {
      await queueService.leaveQueue(queueId);
      setActiveQueues(prevQueues => prevQueues.filter(q => q._id !== queueId));
      toast.success('You have left the queue');
    } catch (error) {
      console.error('Error leaving queue:', error);
      toast.error('Failed to leave the queue');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (activeQueues.length === 0) {
    return (
      <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
        You are not currently in any queues
      </Typography>
    );
  }

  return (
    <Box>
      {activeQueues.map(queue => (
        <UserQueueItem
          key={queue._id}
          queue={queue}
          userPosition={getUserPosition(queue)}
          onLeaveQueue={handleLeaveQueue}
        />
      ))}
    </Box>
  );
};

export default UserActiveQueues;
