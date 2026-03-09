import React from 'react';
import { Typography, Box } from '@mui/material';

const PlaceholderTab: React.FC<{ title: string }> = ({ title }) => (
  <Box sx={{ py: 8, textAlign: 'center' }}>
    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
      This tab is under development.
    </Typography>
  </Box>
);

export default PlaceholderTab;
