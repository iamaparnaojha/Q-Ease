import { useState } from 'react';
import { Box, TextField, Button, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { queueService } from '../services/api';

const QueueForm = ({ onQueueCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const queue = await queueService.createQueue(formData);
      toast.success('Queue created successfully');
      onQueueCreated(queue);
      setFormData({ name: '', description: '' });
    } catch (error) {
      toast.error('Failed to create queue');
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Queue Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          margin="normal"
          required
          multiline
          rows={2}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Create Queue
        </Button>
      </Box>
    </Paper>
  );
};

export default QueueForm;