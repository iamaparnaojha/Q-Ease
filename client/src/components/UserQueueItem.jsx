import { useState } from 'react';
import { 
  Card, CardContent, Typography, Box, Chip, 
  LinearProgress, Button, Grid, Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const UserQueueItem = ({ queue, userPosition, onLeaveQueue }) => {
  const [loading, setLoading] = useState(false);

  // Calculate estimated wait time based on position and service time
  const calculateEstimatedTime = () => {
    if (!userPosition || userPosition <= 0) return 'N/A';
    const waitMinutes = (userPosition - 1) * queue.serviceTime;
    
    if (waitMinutes < 1) {
      return 'Less than a minute';
    } else if (waitMinutes < 60) {
      return `${waitMinutes} minute${waitMinutes !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(waitMinutes / 60);
      const minutes = waitMinutes % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`;
    }
  };

  // Get status color based on position
  const getStatusColor = () => {
    if (!userPosition || userPosition <= 0) return 'default';
    if (userPosition === 1) return 'success';
    if (userPosition <= 3) return 'warning';
    return 'primary';
  };

  // Get status text based on position
  const getStatusText = () => {
    if (!userPosition || userPosition <= 0) return 'Not in queue';
    if (userPosition === 1) return 'You\'re next!';
    return `Position: ${userPosition}`;
  };

  // Calculate progress percentage (inverse of position - closer to 0 means closer to 100%)
  const calculateProgress = () => {
    if (!userPosition || userPosition <= 0 || !queue.participants) return 0;
    const totalInQueue = queue.participants.length;
    if (totalInQueue <= 1) return 100;
    
    // Position 1 should be close to 100%, higher positions lower
    return Math.max(5, Math.min(100, 100 - ((userPosition - 1) / totalInQueue) * 100));
  };

  const handleLeaveQueue = async () => {
    try {
      setLoading(true);
      // This would be an actual API call in a real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onLeaveQueue(queue._id);
      toast.success('You have left the queue');
    } catch (error) {
      toast.error('Failed to leave queue');
      console.error('Error leaving queue:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2, overflow: 'visible' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Typography variant="h6" gutterBottom>
              {queue.name}
            </Typography>
            
            {queue.description && (
              <Typography variant="body2" color="text.secondary" paragraph>
                {queue.description}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PeopleIcon sx={{ mr: 1, color: 'action.active', fontSize: 20 }} />
              <Typography variant="body2">
                People ahead of you: {userPosition > 1 ? userPosition - 1 : 0}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeIcon sx={{ mr: 1, color: 'action.active', fontSize: 20 }} />
              <Typography variant="body2">
                Estimated wait time: {calculateEstimatedTime()}
              </Typography>
            </Box>
            
            <Chip
              icon={userPosition === 1 ? <CheckCircleIcon /> : <HourglassEmptyIcon />}
              label={getStatusText()}
              color={getStatusColor()}
              sx={{ mb: 2 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom align="center">
                  Your Progress
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateProgress()} 
                  sx={{ height: 10, borderRadius: 5, mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary" align="center" display="block">
                  {userPosition === 1 ? 'Almost there!' : `${Math.round(calculateProgress())}% to the front`}
                </Typography>
              </Box>
              
              <Button
                variant="outlined"
                color="error"
                onClick={handleLeaveQueue}
                disabled={loading}
                sx={{ mt: 2 }}
                fullWidth
              >
                Leave Queue
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserQueueItem;
