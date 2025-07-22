import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { clearUserProfile } from '../store/userSlice';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Admin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/signin', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(clearUserProfile());
      window.location.href = window.location.origin + import.meta.env.BASE_URL;
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Welcome, Admin! This is the admin dashboard page.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}
