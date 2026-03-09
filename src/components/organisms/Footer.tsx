import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 1.5,
        px: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        backgroundColor: theme.palette.background.paper,
        flexShrink: 0,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        CognitiveHealth All Rights Reserved. iCAN RCM Platform v6.0
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Session Expiration: 56:41
      </Typography>
    </Box>
  );
};

export default Footer;
