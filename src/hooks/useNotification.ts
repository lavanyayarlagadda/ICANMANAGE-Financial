import { useAppDispatch } from '@/store';
import { showSnackbar } from '@/store/slices/uiSlice';
import { useCallback } from 'react';

/**
 * Custom hook to trigger global notifications (snackbars) from any component.
 */
export const useNotification = () => {
  const dispatch = useAppDispatch();

  const notify = useCallback(
    (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
      dispatch(showSnackbar({ message, severity }));
    },
    [dispatch]
  );

  const notifySuccess = useCallback((message: string) => notify(message, 'success'), [notify]);
  const notifyError = useCallback((message: string) => notify(message, 'error'), [notify]);
  const notifyInfo = useCallback((message: string) => notify(message, 'info'), [notify]);
  const notifyWarning = useCallback((message: string) => notify(message, 'warning'), [notify]);

  return {
    notify,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
  };
};

export default useNotification;
