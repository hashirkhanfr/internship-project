import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AppTheme from '../theme/AppTheme';
import { useDispatch } from 'react-redux';
import { clearUserProfile } from '../store/userSlice';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(clearUserProfile());
      navigate('/signin', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AppTheme>
      <Box sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Welcome to your dashboard! Only verified users can access this page.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </AppTheme>
  );
}
