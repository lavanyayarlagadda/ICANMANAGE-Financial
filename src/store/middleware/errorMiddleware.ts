import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { showSnackbar } from '../slices/uiSlice';

/**
 * Global error middleware that catches all rejected RTK Query actions
 * and displays an error snackbar with the relevant API error message.
 */
export const rtkQueryErrorLogger: Middleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const errorData = action.payload as
      | {
          data?: { message?: string; error?: string };
          status?: string | number;
          error?: string;
          name?: string;
        }
      | undefined;

    // Skip showing an error if it's just an aborted request (e.g. from component unmount or api reset)
    if (
      action.error?.name === 'AbortError' ||
      errorData?.name === 'AbortError' ||
      (errorData?.status === 'FETCH_ERROR' && String(errorData?.error).includes('AbortError')) ||
      String(errorData?.error).includes('aborted') ||
      (String(errorData?.error).includes('Failed to fetch') && action.meta?.aborted)
    ) {
      return next(action);
    }

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
      }),
    );
  }

  return next(action);
};
