import React from 'react';
import { Box, Typography } from '@mui/material';

const StatementsScreen: React.FC = () => {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" color="text.secondary">
        Statements Screen Coming Soon
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Access your historical statements and monthly financial reports here.
      </Typography>
    </Box>
  );
};

export default StatementsScreen;
