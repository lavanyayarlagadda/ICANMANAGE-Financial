import React from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        textAlign: 'center',
      }}
    >
      <Box>
        <Typography variant="h1" sx={{ fontWeight: 800, color: 'text.primary', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Oops! Page not found
        </Typography>
        <Button variant="contained" href="/">
          Return to Home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
