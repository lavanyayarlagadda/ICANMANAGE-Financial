import { styled } from '@mui/material/styles';
import { Box, Typography, ListItemButton, Avatar, SxProps, Theme } from '@mui/material';

export const ScreenWrapper = styled(Box)(() => ({
  // padding handled by parent
}));

export const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
}));

export const PatientNameHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
}));

export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledAvatar = styled(Avatar)<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.grey[300],
  width: 32,
  height: 32,
}));

export const MonospaceAmount = styled(Typography)(() => ({
  fontFamily: 'monospace',
}));

export const headerWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const refreshWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const refreshTextStyles: SxProps<Theme> = {
  fontWeight: 600,
  color: 'primary.main',
};

export const claimsSectionWrapperStyles: SxProps<Theme> = {
  mb: 3,
};

export const claimsHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 1,
};

export const boldTextStyles: SxProps<Theme> = {
  fontWeight: 700,
};

export const paperStyles: SxProps<Theme> = {
  borderRadius: 2,
  overflow: 'hidden',
};

export const paginationWrapperStyles: SxProps<Theme> = {
  p: 1,
  display: 'flex',
  justifyContent: 'center',
  borderTop: '1px solid',
  borderColor: 'divider',
};

export const providerTextStyles: SxProps<Theme> = {
  fontWeight: 600,
};

export const serviceLinesHeaderStyles: SxProps<Theme> = {
  mt: 4,
  mb: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const loadingBadgeStyles = (hoverBg: string): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  bgcolor: hoverBg,
  px: 1.5,
  py: 0.5,
  borderRadius: 1,
});

export const loadingTextStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: 'primary.main',
};
