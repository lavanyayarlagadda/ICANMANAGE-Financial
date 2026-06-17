import { styled } from '@mui/material/styles';
import { Box, Typography, ListItemButton, Avatar } from '@mui/material';

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

import { Paper } from '@mui/material';

export const HeaderWrapperBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const RefreshWrapperBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

export const RefreshTextTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const ClaimsSectionWrapperBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const ClaimsHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

export const BoldTextTypography = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const StyledPaper = styled(Paper)(() => ({
  borderRadius: '8px',
  overflow: 'hidden',
}));

export const PaginationWrapperBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  borderTop: '1px solid',
  borderColor: theme.palette.divider,
}));

export const ProviderTextTypography = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const ServiceLinesHeaderBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const LoadingBadgeBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hoverBg',
})<{ hoverBg: string }>(({ hoverBg }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: hoverBg,
  paddingLeft: '12px',
  paddingRight: '12px',
  paddingTop: '4px',
  paddingBottom: '4px',
  borderRadius: '4px',
}));

export const LoadingTextTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
}));
