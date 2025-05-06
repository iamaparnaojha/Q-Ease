import { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, TextField,
  Grid, AppBar, Toolbar, IconButton, Menu, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogActions, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Divider,
  Avatar, Tooltip, Chip
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import QrCodeIcon from '@mui/icons-material/QrCode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';


const AdminDashboard = () => {
  const [queues, setQueues] = useState([]);
  const [newQueue, setNewQueue] = useState({
    name: '',
    description: '',
    serviceTime: 5 // default 5 minutes
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/queues', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setQueues(data);
    } catch (error) {
      console.error('Error fetching queues:', error);
    }
  };

  const handleCreateQueue = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/queues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newQueue)
      });
      const data = await response.json();
      setQueues([...queues, data]);
      setNewQueue({ name: '', description: '', serviceTime: 5 });
    } catch (error) {
      console.error('Error creating queue:', error);
    }
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

  const handleViewDetails = (queue) => {
    setSelectedQueue(queue);
    setDetailsOpen(true);
  };

  const handleViewQR = (queue) => {
    setSelectedQueue(queue);
    setQrDialogOpen(true);
  };

  const handleCopyQueueLink = (code) => {
    const link = `${window.location.origin}/join/${code}`;
    navigator.clipboard.writeText(link);
    toast.success('Queue link copied to clipboard!');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navbar with profile icon */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Qease Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.name || 'Admin'}
            </Typography>
            <IconButton color="inherit" onClick={handleProfileClick}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.name?.charAt(0) || 'A'}
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

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Create Queue Form */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                Create New Queue
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box component="form" onSubmit={handleCreateQueue}>
                <TextField
                  fullWidth
                  label="Queue Name"
                  required
                  value={newQueue.name}
                  onChange={(e) => setNewQueue({...newQueue, name: e.target.value})}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description (Optional)"
                  multiline
                  rows={2}
                  value={newQueue.description}
                  onChange={(e) => setNewQueue({...newQueue, description: e.target.value})}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Service Time (minutes)"
                  type="number"
                  required
                  value={newQueue.serviceTime}
                  onChange={(e) => setNewQueue({...newQueue, serviceTime: parseInt(e.target.value) || 5})}
                  sx={{ mb: 3 }}
                  placeholder="5"
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<QueueOutlinedIcon />}
                  fullWidth
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  Create Queue
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Active Queues Table */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                Active Queues
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {queues.length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  No active queues. Create your first queue to get started!
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography variant="subtitle2">Queue Name</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2">Unique ID</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2">Service Time</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2">Actions</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {queues.map((queue) => (
                        <TableRow key={queue._id} hover>
                          <TableCell>
                            <Typography variant="body1">{queue.name}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {queue.description ? queue.description.substring(0, 30) + (queue.description.length > 30 ? '...' : '') : 'No description'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={queue.code}
                              color="primary"
                              variant="outlined"
                              size="small"
                              onClick={() => handleCopyQueueLink(queue.code)}
                            />
                          </TableCell>
                          <TableCell>{queue.serviceTime} min</TableCell>
                          <TableCell>
                            <Tooltip title="View QR Code">
                              <IconButton color="primary" onClick={() => handleViewQR(queue)}>
                                <QrCodeIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View Queue Details">
                              <IconButton color="secondary" onClick={() => handleViewDetails(queue)}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Queue Details Dialog */}
        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
          {selectedQueue && (
            <>
              <DialogTitle>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  Queue Details: {selectedQueue.name}
                </Typography>
              </DialogTitle>
              <DialogContent dividers>
                <Box sx={{ p: 1 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Queue Information
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Description:</strong> {selectedQueue.description || 'No description'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Service Time:</strong> {selectedQueue.serviceTime} minutes
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Queue Code:</strong> {selectedQueue.code}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Created:</strong> {new Date(selectedQueue.createdAt).toLocaleString()}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Current Number:</strong> {selectedQueue.currentNumber || 0}
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => handleCopyQueueLink(selectedQueue.code)}
                        startIcon={<QrCodeIcon />}
                        sx={{ mt: 2 }}
                      >
                        Copy Queue Link
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        Queue QR Code
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <QRCodeSVG
                          value={`${window.location.origin}/join/${selectedQueue.code}`}
                          size={180}
                          level="H"
                        />
                      </Box>
                      <Typography variant="caption" color="textSecondary" align="center" display="block">
                        Scan this QR code to join the queue
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Active Participants
                  </Typography>

                  {selectedQueue.participants && selectedQueue.participants.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Joined At</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedQueue.participants.map((participant) => (
                            <TableRow key={participant._id}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                                  {participant.user?.name || 'Unknown User'}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={participant.status}
                                  color={
                                    participant.status === 'waiting' ? 'warning' :
                                    participant.status === 'processing' ? 'info' :
                                    participant.status === 'completed' ? 'success' : 'default'
                                  }
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{new Date(participant.joinedAt).toLocaleTimeString()}</TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  disabled={participant.status === 'completed'}
                                >
                                  {participant.status === 'waiting' ? 'Process' : 'Complete'}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
                      No active participants in this queue
                    </Typography>
                  )}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* QR Code Dialog */}
        <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)}>
          {selectedQueue && (
            <>
              <DialogTitle>
                <Typography variant="h6">
                  QR Code for {selectedQueue.name}
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <QRCodeSVG
                    value={`${window.location.origin}/join/${selectedQueue.code}`}
                    size={250}
                    level="H"
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
                    Scan this QR code or share the link below to join the queue
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      p: 1,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {`${window.location.origin}/join/${selectedQueue.code}`}
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleCopyQueueLink(selectedQueue.code)}
                    >
                      Copy
                    </Button>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
