import React from 'react';
import { Typography, Button } from '@mui/material';
import { NotFoundWrapper, ContentBox } from './NotFound.styles';
import { useNotFound } from './NotFound.hook';

const NotFound: React.FC = () => {
  const { path } = useNotFound();

  return (
    <NotFoundWrapper>
      <ContentBox>
        <Typography variant="h1" sx={{ fontWeight: 800, color: 'text.primary', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Oops! Page not found at {path}
        </Typography>
        <Button variant="contained" href="/">
          Return to Home
        </Button>
      </ContentBox>
    </NotFoundWrapper>
  );
};

export default NotFound;
