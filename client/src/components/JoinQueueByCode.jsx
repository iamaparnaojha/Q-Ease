import { useState } from 'react';
import {
  Box, TextField, Button, Typography,
  Paper, CircularProgress, Alert
} from '@mui/material';
import { toast } from 'react-toastify';
import { queueService } from '../services/api';

const JoinQueueByCode = ({ onQueueJoined }) => {
  const [queueCode, setQueueCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [queueInfo, setQueueInfo] = useState(null);

  const handleFindQueue = async (e) => {
    e.preventDefault();
    if (!queueCode.trim()) {
      setError('Please enter a queue code');
      return;
    }

    setError('');
    setLoading(true);
    setQueueInfo(null);

    try {
      // First, fetch the queue information
      const queueData = await queueService.getQueueByCode(queueCode);
      setQueueInfo(queueData);
    } catch (error) {
      console.error('Error finding queue:', error);
      setError('Failed to find queue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = async () => {
    if (!queueInfo) return;

    setLoading(true);
    try {
      const joinedQueue = await queueService.joinQueue(queueInfo._id);
      toast.success(`Successfully joined ${queueInfo.name}`);

      // Reset form
      setQueueCode('');
      setQueueInfo(null);

      // Notify parent component
      if (onQueueJoined) {
        onQueueJoined(joinedQueue);
      }
    } catch (error) {
      console.error('Error joining queue:', error);
      toast.error('Failed to join queue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleFindQueue}>
        <TextField
          fullWidth
          label="Queue Code"
          value={queueCode}
          onChange={(e) => setQueueCode(e.target.value)}
          disabled={loading}
          error={!!error}
          helperText={error}
          placeholder="Enter the unique queue code"
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mb: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Find Queue'}
        </Button>
      </Box>

      {queueInfo && (
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {queueInfo.name}
          </Typography>

          {queueInfo.description && (
            <Typography variant="body2" color="text.secondary" paragraph>
              {queueInfo.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant="body2">
              Service time: {queueInfo.serviceTime} minutes
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={handleJoinQueue}
              disabled={loading}
            >
              Join This Queue
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default JoinQueueByCode;
