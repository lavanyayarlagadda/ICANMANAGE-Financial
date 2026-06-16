import React from 'react';
import pkg from '../../../../package.json';
import { Typography } from '@mui/material';
import { useFooter } from './Footer.hook';
import { FooterContainer } from './Footer.styles';

const Footer: React.FC = () => {
  const { timeLeft, formatTime, drawerWidth } = useFooter();
  return (
    <FooterContainer component="footer" drawerWidth={drawerWidth}>
      <Typography variant="caption" color="text.secondary">
        © {new Date().getFullYear()} CognitiveHealth All Rights Reserved. iCAN RCM Platform v
        {pkg.version}
      </Typography>
      <Typography
        variant="caption"
        color={timeLeft <= 60 && timeLeft > 0 ? 'error' : 'text.secondary'}
      >
        Session Expiration: {formatTime(timeLeft)}
      </Typography>
    </FooterContainer>
  );
};

export default Footer;
