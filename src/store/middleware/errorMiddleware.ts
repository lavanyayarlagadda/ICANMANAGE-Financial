import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { showSnackbar } from '../slices/uiSlice';

/**
 * Global error middleware that catches all rejected RTK Query actions
 * and displays an error snackbar with the relevant API error message.
 */
export const rtkQueryErrorLogger: Middleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const errorData = action.payload as any;
    
    // Extract meaningful error message from API response
    // Handing both fetchBaseQuery format and generic formats
    const errorMessage = 
      errorData?.data?.message || 
      errorData?.data?.error || 
      errorData?.status || 
      'An unexpected error occurred while communicating with the server.';

    // Dispatch the snackbar action
    api.dispatch(
      showSnackbar({
        message: `API Error: ${errorMessage}`,
        severity: 'error',
      })
    );
  }

  return next(action);
};
