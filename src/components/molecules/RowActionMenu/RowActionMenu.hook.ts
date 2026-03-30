import React, { useState, useCallback } from 'react';

export const useRowActionMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleAction = useCallback((callback: () => void) => {
    handleClose();
    callback();
  }, [handleClose]);

  return {
    anchorEl,
    open: Boolean(anchorEl),
    handleClick,
    handleClose,
    handleAction,
  };
};
