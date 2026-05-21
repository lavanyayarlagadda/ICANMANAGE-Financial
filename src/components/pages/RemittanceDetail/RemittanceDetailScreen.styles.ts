import { styled } from '@mui/material/styles';
import { Box, Typography, ListItemButton, Avatar } from '@mui/material';

export const ScreenWrapper = styled(Box)(({ theme }) => ({
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
  }
}));

export const StyledAvatar = styled(Avatar)<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.grey[300],
  width: 32,
  height: 32,
}));

export const MonospaceAmount = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
}));
