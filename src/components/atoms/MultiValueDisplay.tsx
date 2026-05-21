import React from 'react';
import { Box, Chip, Tooltip, Stack, Typography, Popover, TextField, InputAdornment, List, ListItem, ListItemText, ListItemIcon, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';

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
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  if (!value) return <Typography variant="body2" color="text.secondary">-</Typography>;

  const items = value.split(',').map(s => s.trim()).filter(Boolean);
  if (items.length === 0) return <Typography variant="body2" color="text.secondary">-</Typography>;

  const hasMore = items.length > displayCount;
  const displayItems = items.slice(0, displayCount);
  const remainingCount = items.length - displayCount;

  const handleOpenPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
    setSearchQuery('');
  };

  const handleCopy = (text: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
  };

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const open = Boolean(anchorEl);
  const id = open ? 'multi-value-popover' : undefined;

  return (
    <Box sx={{ py: 0.5 }}>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
        {displayItems.map((item, idx) => (
          <Tooltip key={idx} title={item} arrow>
            <Chip
              label={item}
              size="small"
              variant="outlined"
              onClick={(e) => handleCopy(item, e)}
              icon={<ContentCopyIcon sx={{ fontSize: '10px !important' }} />}
              sx={{
                height: 22,
                fontSize: 11,
                bgcolor: 'action.hover',
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.selected' },
                maxWidth: maxWidth,
                '& .MuiChip-label': {
                  px: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }
              }}
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
                sx={{
                  height: 22,
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'primary.main',
                  bgcolor: '#eff6ff',
                  border: theme => `1px solid ${theme.palette.primary.light}`,
                  '&:hover': { bgcolor: '#dbeafe' }
                }}
              />
            </Tooltip>
          </Box>
        )}
      </Stack>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: 280,
            maxHeight: 400,
            borderRadius: 2,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
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
              sx: { height: 32, fontSize: 13, bgcolor: '#fff' }
            }}
          />
        </Box>
        <List sx={{ pt: 0, overflowY: 'auto', flex: 1, p: 0.5 }}>
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
