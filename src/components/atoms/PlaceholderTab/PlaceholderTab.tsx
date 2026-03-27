import React from 'react';
import { Typography, Box } from '@mui/material';
import * as styles from './PlaceholderTab.styles';

const PlaceholderTab: React.FC<{ title: string }> = ({ title }) => (
  <Box sx={styles.containerStyles}>
    <Typography variant="h6" color="text.secondary" sx={styles.titleStyles}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.disabled" sx={styles.subtitleStyles}>
      This tab is under development.
    </Typography>
  </Box>
);

export default PlaceholderTab;
