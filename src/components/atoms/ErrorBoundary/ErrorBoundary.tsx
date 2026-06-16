import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Container, Typography } from '@mui/material';
import {
  ErrorContainer,
  ErrorPaper,
  ErrorIcon,
  ErrorDescription,
  DetailsBox,
  PreText,
  ActionsWrapper,
} from './ErrorBoundary.styles';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service like Sentry
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="md">
          <ErrorContainer>
            <ErrorPaper elevation={3}>
              <ErrorIcon />
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Oops! Something went wrong
              </Typography>
              <ErrorDescription variant="body1" color="text.secondary">
                We encountered an unexpected error. This has been logged, and we are working to fix
                it. Please try refreshing the page or returning to the dashboard.
              </ErrorDescription>

              {import.meta.env.DEV && this.state.error && (
                <DetailsBox>
                  <PreText variant="caption" component="pre">
                    {this.state.error.toString()}
                  </PreText>
                </DetailsBox>
              )}

              <ActionsWrapper>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
                <Button variant="outlined" size="large" onClick={this.handleReset}>
                  Go to Dashboard
                </Button>
              </ActionsWrapper>
            </ErrorPaper>
          </ErrorContainer>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
