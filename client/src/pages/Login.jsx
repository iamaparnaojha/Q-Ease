import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Submitting:', { email: formData.email, password: formData.password });
      
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        return;
      }

      const response = await login(formData.email, formData.password);
      console.log('Login response:', response);
      
      if (response.user) {
        navigate(response.user.role === 'admin' ? '/admin-dashboard' : '/dashboard');
      } else {
        setError('Login failed - invalid response');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          Sign In
        </Typography>

        {location.state?.message && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {location.state.message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/register')}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
