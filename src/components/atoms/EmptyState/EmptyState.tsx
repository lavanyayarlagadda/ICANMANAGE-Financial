import React from 'react';
import InboxIcon from '@mui/icons-material/Inbox';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import * as styles from './EmptyState.styles';

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
    <styles.ContainerBox>
      <styles.IconWrapper>
        <Icon />
      </styles.IconWrapper>
      <styles.StyledTypographyHeader variant="h6">{title}</styles.StyledTypographyHeader>
      <styles.StyledTypographyDescription variant="body2">
        {description}
      </styles.StyledTypographyDescription>
      {onClearFilters && (
        <styles.ClearFiltersButton variant="outlined" color="primary" onClick={onClearFilters}>
          Clear All Filters
        </styles.ClearFiltersButton>
      )}
    </styles.ContainerBox>
  );
};

export default EmptyState;
