import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80vh',
              textAlign: 'center',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 5,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'background.paper',
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                We encountered an unexpected error. This has been logged, and we are working to fix it.
                Please try refreshing the page or returning to the dashboard.
              </Typography>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box 
                  sx={{ 
                    mt: 2, 
                    mb: 4, 
                    p: 2, 
                    bgcolor: 'grey.100', 
                    borderRadius: 1, 
                    textAlign: 'left',
                    width: '100%',
                    overflowX: 'auto'
                  }}
                >
                  <Typography variant="caption" component="pre" sx={{ color: 'error.dark' }}>
                    {this.state.error.toString()}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={this.handleReset}
                >
                  Go to Dashboard
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
