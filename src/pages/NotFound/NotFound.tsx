import React from 'react';
import { Button } from '@mui/material';
import { NotFoundWrapper, ContentBox, TitleText, Subtext } from './NotFound.styles';
import { useNotFound } from './NotFound.hook';

const NotFound: React.FC = () => {
  const { path } = useNotFound();

  return (
    <NotFoundWrapper>
      <ContentBox>
        <TitleText variant="h1">404</TitleText>
        <Subtext variant="h6" color="text.secondary">
          Oops! Page not found at {path}
        </Subtext>
        <Button variant="contained" href="/">
          Return to Home
        </Button>
      </ContentBox>
    </NotFoundWrapper>
  );
};

export default NotFound;
