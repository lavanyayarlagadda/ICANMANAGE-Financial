import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { themeConfig } from '@/theme/themeConfig';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'empty' | 'search';
  onClearFilters?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = "We couldn't find any records matching your current criteria.",
  icon = 'empty',
  onClearFilters,
}) => {
  const Icon = icon === 'search' ? SearchOffIcon : InboxIcon;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // py: 2,
        // px: 2,
        textAlign: 'center',
        backgroundColor: 'background.paper',
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: 'grey.50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // mb: 1,
        }}
      >
        <Icon sx={{ fontSize: 32, color: 'text.disabled' }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400 }}>
        {description}
      </Typography>
      {onClearFilters && (
        <Button
          variant="outlined"
          color="primary"
          onClick={onClearFilters}
          sx={{
            borderRadius: themeConfig.spacing.borderRadius.md,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Clear All Filters
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
