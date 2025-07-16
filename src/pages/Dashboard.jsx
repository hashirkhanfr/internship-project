import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AppTheme from '../theme/AppTheme';

export default function Dashboard() {
  return (
    <AppTheme>
      <Box sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to your dashboard! Only verified users can access this page.
        </Typography>
      </Box>
    </AppTheme>
  );
}
