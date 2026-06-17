import React from 'react';
import { Tooltip, InputAdornment, ListItem, Typography } from '@mui/material';
import { useMultiValueDisplay } from './MultiValueDisplay.hook';
import * as styles from './MultiValueDisplay.styles';

interface MultiValueDisplayProps {
  value: string;
  displayCount?: number;
  maxWidth?: number | string;
  hideSearch?: boolean;
  delimiter?: string | RegExp;
}

const MultiValueDisplay: React.FC<MultiValueDisplayProps> = ({
  value,
  displayCount = 2,
  maxWidth = 140,
  hideSearch = false,
  delimiter = ',',
}) => {
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
  } = useMultiValueDisplay(value, delimiter);
  if (!value || value === '-' || value.trim() === '')
    return (
      <Typography variant="body2" color="text.secondary">
        -
      </Typography>
    );

  if (items.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        -
      </Typography>
    );

  const hasMore = items.length > displayCount;
  const displayItems = items.slice(0, displayCount);
  const remainingCount = items.length - displayCount;

  return (
    <styles.ContainerBox>
      <styles.StyledStack
        direction="row"
        spacing={0.5}
        flexWrap="wrap"
        useFlexGap
        justifyContent="center"
      >
        {displayItems.map((item, idx) => (
          <Tooltip key={idx} title={item} arrow>
            <styles.StyledChip
              label={item}
              size="small"
              variant="outlined"
              onClick={(e) => handleCopy(item, e)}
              icon={<styles.CopyIconSmall />}
              maxwidth={maxWidth}
            />
          </Tooltip>
        ))}
        {hasMore && (
          <styles.InlineFlexBox onClick={handleOpenPopover}>
            <Tooltip title="Click to view all" arrow>
              <styles.MoreChip label={`+${remainingCount} more`} size="small" clickable />
            </Tooltip>
          </styles.InlineFlexBox>
        )}
      </styles.StyledStack>

      <styles.StyledPopover
        id={open ? 'multi-value-popover' : undefined}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <styles.PopoverHeader>
          <styles.PopoverTitle variant="subtitle2">Items ({items.length})</styles.PopoverTitle>
          {!hideSearch && (
            <styles.SearchTextField
              fullWidth
              size="small"
              placeholder="Search numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <styles.SearchIconStyled />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </styles.PopoverHeader>
        <styles.StyledList>
          {filteredItems.map((item, idx) => (
            <ListItem
              key={idx}
              disablePadding
              secondaryAction={
                <styles.CopyIconButton edge="end" size="small" onClick={(e) => handleCopy(item, e)}>
                  <styles.CopyIconNormal />
                </styles.CopyIconButton>
              }
            >
              <styles.ListItemTextStyled
                primary={item}
                primaryTypographyProps={{
                  variant: 'body2',
                }}
              />
            </ListItem>
          ))}
          {filteredItems.length === 0 && (
            <styles.EmptyStateBox>
              <Typography variant="caption" color="text.secondary">
                No items match your search
              </Typography>
            </styles.EmptyStateBox>
          )}
        </styles.StyledList>
      </styles.StyledPopover>
    </styles.ContainerBox>
  );
};

export default MultiValueDisplay;
