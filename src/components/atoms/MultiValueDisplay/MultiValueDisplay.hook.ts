import { useState, useCallback } from 'react';

export const useMultiValueDisplay = (value: string) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const items = (value || '').split(',').map(s => s.trim()).filter(Boolean);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
    setSearchQuery('');
  }, []);

  const handleCopy = useCallback((text: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
  }, []);

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    items,
    anchorEl,
    searchQuery,
    setSearchQuery,
    handleOpenPopover,
    handleClosePopover,
    handleCopy,
    filteredItems,
    open: Boolean(anchorEl),
  };
};
