import { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminCheck = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        setMessage(`You are logged in as admin (${user.name}). You can access the admin dashboard.`);
      } else {
        setMessage('You are logged in but do not have admin privileges.');
      }
    } else {
      setMessage('You are not logged in.');
    }
  }, [isAuthenticated, user]);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard Access Check
        </Typography>
        
        <Box sx={{ my: 3 }}>
          <Typography variant="body1" paragraph>
            {message}
          </Typography>
          
          <Typography variant="body1" paragraph>
            Current user: {user ? `${user.name} (${user.email})` : 'Not logged in'}
          </Typography>
          
          <Typography variant="body1" paragraph>
            Role: {user?.role || 'N/A'}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          {user?.role === 'admin' && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/admin-dashboard')}
            >
              Go to Admin Dashboard
            </Button>
          )}
          
          <Button 
            variant="outlined"
            onClick={() => navigate('/login')}
          >
            {isAuthenticated ? 'Switch Account' : 'Login'}
          </Button>
          
          <Button 
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminCheck;
