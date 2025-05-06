import { useEffect } from 'react';
import { Card, CardContent, Typography, Button, Chip, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { queueService } from '../services/api';
import { toast } from 'react-toastify';

const QueueItem = ({ queue, onUpdate, isAdmin }) => {
  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    socket.emit('joinQueue', queue._id);
    
    socket.on('queueUpdated', (updatedQueue) => {
      if (updatedQueue._id === queue._id) {
        onUpdate(updatedQueue);
      }
    });

    return () => {
      socket.off('queueUpdated');
    };
  }, [queue._id]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString();
  };

  const getEstimatedWaitTime = (participant) => {
    if (!participant.estimatedStartTime) return 'N/A';
    const waitTime = new Date(participant.estimatedStartTime) - new Date();
    return Math.max(0, Math.round(waitTime / 60000)) + ' minutes';
  };

  const handleJoin = async () => {
    try {
      const updatedQueue = await queueService.joinQueue(queue._id);
      onUpdate(updatedQueue);
      toast.success('Joined queue successfully');
    } catch (error) {
      toast.error('Failed to join queue');
    }
  };

  const handleStatusUpdate = async (userId, status) => {
    try {
      const updatedQueue = await queueService.updateParticipantStatus(queue._id, userId, status);
      onUpdate(updatedQueue);
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const isUserInQueue = queue.participants.some(p => p.user._id === user._id);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{queue.name}</Typography>
        <Typography color="textSecondary" gutterBottom>
          {queue.description}
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Participants:</Typography>
          {queue.participants.map((participant) => (
            <Box key={participant.user._id} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography>{participant.user.name}</Typography>
              <Chip 
                label={participant.status}
                color={participant.status === 'completed' ? 'success' : 'primary'}
                size="small"
                sx={{ ml: 1 }}
              />
              {isAdmin && (
                <Box sx={{ ml: 2 }}>
                  <Button
                    size="small"
                    onClick={() => handleStatusUpdate(participant.user._id, 'processing')}
                    disabled={participant.status === 'processing'}
                  >
                    Process
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleStatusUpdate(participant.user._id, 'completed')}
                    disabled={participant.status === 'completed'}
                  >
                    Complete
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {!isUserInQueue && !isAdmin && (
          <Button
            variant="contained"
            onClick={handleJoin}
            sx={{ mt: 2 }}
          >
            Join Queue
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default QueueItem;
