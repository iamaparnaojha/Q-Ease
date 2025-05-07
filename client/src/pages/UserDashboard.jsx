import { useState } from 'react';
import {
  Container, Typography, Box, AppBar, Toolbar,
  IconButton, Avatar, Menu, MenuItem, Tabs, Tab,
  Paper, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QueueList from '../components/QueueList';
import JoinQueueByCode from '../components/JoinQueueByCode';
import UserActiveQueues from '../components/UserActiveQueues';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';

const UserDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQueueJoined = () => {
    // Switch to the My Queues tab after joining a queue
    setTabValue(1);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navbar with profile icon */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Qease User Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.name || 'User'}
            </Typography>
            <IconButton color="inherit" onClick={handleProfileClick}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Join Queue" />
          <Tab label="My Queues" />
          <Tab label="Available Queues" />
        </Tabs>

        {/* Join Queue Tab */}
        {tabValue === 0 && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              Join a Queue
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <JoinQueueByCode onQueueJoined={handleQueueJoined} />
          </Paper>
        )}

        {/* My Queues Tab */}
        {tabValue === 1 && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              My Active Queues
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <UserActiveQueues />
          </Paper>
        )}

        {/* Available Queues Tab */}
        {tabValue === 2 && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              Available Queues
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <QueueList isAdmin={false} />
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default UserDashboard;