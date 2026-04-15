import React from 'react';
import { Box, Chip, Tooltip, Stack, Typography, Popover, TextField, InputAdornment, List, ListItem, ListItemText, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import { useMultiValueDisplay } from './MultiValueDisplay.hook';
import * as styles from './MultiValueDisplay.styles';

interface MultiValueDisplayProps {
  value: string;
  displayCount?: number;
  maxWidth?: number | string;
}

const MultiValueDisplay: React.FC<MultiValueDisplayProps> = ({
  value,
  displayCount = 2,
  maxWidth = 140
}) => {
  if (!value) return <Typography variant="body2" color="text.secondary">-</Typography>;

  const {
    items,
    searchQuery,
    setSearchQuery,
    handleOpenPopover,
    handleClosePopover,
    handleCopy,
    filteredItems,
    open,
    anchorEl,
  } = useMultiValueDisplay(value);

  if (items.length === 0) return <Typography variant="body2" color="text.secondary">-</Typography>;

  const hasMore = items.length > displayCount;
  const displayItems = items.slice(0, displayCount);
  const remainingCount = items.length - displayCount;

  return (
    <Box sx={styles.containerStyles}>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
        {displayItems.map((item, idx) => (
          <Tooltip key={idx} title={item} arrow>
            <Chip
              label={item}
              size="small"
              variant="outlined"
              onClick={(e) => handleCopy(item, e)}
              icon={<ContentCopyIcon sx={{ fontSize: '10px !important' }} />}
              sx={styles.chipStyles(maxWidth)}
            />
          </Tooltip>
        ))}
        {hasMore && (
          <Box sx={{ display: 'inline-flex' }} onClick={handleOpenPopover}>
            <Tooltip title="Click to view all" arrow>
              <Chip
                label={`+${remainingCount} more`}
                size="small"
                clickable
                sx={styles.moreChipStyles}
              />
            </Tooltip>
          </Box>
        )}
      </Stack>

      <Popover
        id={open ? 'multi-value-popover' : undefined}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: styles.popoverPaperProps }}
      >
        <Box sx={{ p: 1.5, bgcolor: 'primary.50', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'primary.main', fontSize: 13 }}>
            Items ({items.length})
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              sx: { height: 32, fontSize: 13, bgcolor: 'background.paper' }
              }}
            />
          </Box>
        <List sx={styles.listStyles}>
          {filteredItems.map((item, idx) => (
            <ListItem
              key={idx}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => handleCopy(item, e)}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  <ContentCopyIcon sx={{ fontSize: 16 }} />
                </IconButton>
              }
            >
              <ListItemText
                primary={item}
                primaryTypographyProps={{
                  variant: 'body2',
                  sx: { fontSize: 13, fontWeight: 500, fontFamily: 'monospace', py: 0.5, px: 1 }
                }}
              />
            </ListItem>
          ))}
          {filteredItems.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">No items match your search</Typography>
            </Box>
          )}
        </List>
      </Popover>
    </Box>
  );
};

export default MultiValueDisplay;
