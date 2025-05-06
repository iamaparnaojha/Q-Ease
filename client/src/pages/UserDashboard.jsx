import { Container, Typography } from '@mui/material';
import QueueList from '../components/QueueList';

const UserDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Queues
      </Typography>
      <QueueList isAdmin={false} />
    </Container>
  );
};

export default UserDashboard;