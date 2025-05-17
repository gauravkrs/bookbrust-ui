import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const SignUpPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const data = await api.signup({ email, password, alias });
      localStorage.setItem('token', data.token);
      login(data.token, { email: data.user.email, alias: data.user.alias });
      navigate('/');
    } catch (err) {
      const message = err?.message || 'Signup failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={3} textAlign="center">
        Create Account
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <TextField
          label="Alias (public name)"
          required
          fullWidth
          margin="normal"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          disabled={loading}
        />
        <TextField
          label="Password"
          type="password"
          required
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <TextField
          label="Confirm Password"
          type="password"
          required
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>

      <Typography mt={2} textAlign="center">
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </Box>
  );
};

export default SignUpPage;
