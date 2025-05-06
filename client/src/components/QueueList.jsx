import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { queueService } from '../services/api';
import QueueItem from './QueueItem';
import { toast } from 'react-toastify';

const QueueList = ({ isAdmin }) => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueues = async () => {
    try {
      const data = await queueService.getAllQueues();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setQueues(data);
      } else {
        console.error('Expected array but got:', data);
        setQueues([]); // Set to empty array if not an array
        toast.error('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching queues:', error);
      setQueues([]); // Set to empty array on error
      toast.error('Failed to fetch queues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  const handleQueueUpdate = (updatedQueue) => {
    setQueues(queues.map(q => q._id === updatedQueue._id ? updatedQueue : q));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Active Queues
      </Typography>
      {queues.length === 0 ? (
        <Typography color="textSecondary">No active queues</Typography>
      ) : (
        queues.map((queue) => (
          <QueueItem
            key={queue._id}
            queue={queue}
            onUpdate={handleQueueUpdate}
            isAdmin={isAdmin}
          />
        ))
      )}
    </Box>
  );
};

export default QueueList;