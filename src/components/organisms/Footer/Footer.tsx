import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useFooter } from './Footer.hook';
import * as styles from './Footer.styles';

const Footer: React.FC = () => {
  const theme = useTheme();
  const { timeLeft, formatTime } = useFooter();

  return (
    <Box component="footer" sx={styles.footerStyles(theme)}>
      <Typography variant="caption" color="text.secondary">
        CognitiveHealth All Rights Reserved. iCAN RCM Platform v6.0
      </Typography>
      <Typography variant="caption" color={timeLeft <= 60 && timeLeft > 0 ? "error" : "text.secondary"}>
        Session Expiration: {formatTime(timeLeft)}
      </Typography>
    </Box>
  );
};

export default Footer;
