import { Box, Button, Container, Typography, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QueueIcon from '@mui/icons-material/Queue';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

const Home = () => {
  const navigate = useNavigate();

  const handleJoin = (role) => {
    navigate('/register', { state: { role } });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #2196f3 0%, #1976d2 100%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4,
          }}
        >
          {/* Left side - Hero content */}
          <Box sx={{ flex: 1, color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2 }}>
              <QueueIcon sx={{ fontSize: 40, mr: 1 }} />
              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
                Qease
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Smart Queue Management System
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Choose how you want to join our platform
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => handleJoin('admin')}
                sx={{
                  bgcolor: 'white',
                  color: '#1976d2',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Join as Admin
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<PersonIcon />}
                onClick={() => handleJoin('user')}
                sx={{
                  bgcolor: '#4caf50',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#388e3c',
                  },
                }}
              >
                Join as User
              </Button>
            </Stack>
            <Button
              variant="text"
              sx={{ 
                color: 'white', 
                mt: 2,
                textDecoration: 'underline',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
              onClick={() => navigate('/login')}
            >
              Already have an account? Sign In
            </Button>
          </Box>

          {/* Right side - Features */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              p: 4,
              borderRadius: 4,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 'bold' }}>
              Key Features
            </Typography>
            <Stack spacing={2}>
              {[
                {
                  title: 'Real-time Queue Monitoring',
                  description: 'Track and manage queues in real-time with live updates and notifications.',
                },
                {
                  title: 'Smart Queue Analytics',
                  description: 'Get insights into waiting times, service efficiency, and customer flow patterns.',
                },
                {
                  title: 'Multi-location Support',
                  description: 'Manage queues across multiple locations from a single dashboard.',
                },
                {
                  title: 'Customer Notifications',
                  description: 'Keep customers informed with automated SMS and email notifications.',
                },
              ].map((feature, index) => (
                <Box key={index}>
                  <Typography variant="h6" sx={{ color: '#1976d2' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    {feature.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
