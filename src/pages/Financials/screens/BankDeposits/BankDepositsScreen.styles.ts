import { styled } from '@mui/material/styles';
import { Box, Chip, TextField, Button, Typography, SxProps, Theme } from '@mui/material';

export const ScreenWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 3, 4, 3),
}));

export const ScreenHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
}));

export const EntityChip = styled(Chip)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.grey[100],
  color: isSelected ? theme.palette.common.white : theme.palette.text.secondary,
  fontWeight: 600,
  fontSize: '12px',
  marginBottom: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: isSelected ? theme.palette.primary.dark : theme.palette.grey[200],
  },
}));

export const ToolbarWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  flex: '1 1 auto',
  [theme.breakpoints.up('md')]: {
    flex: '0 0 320px',
  },
  '& .MuiOutlinedInput-root': {
    height: 36,
    fontSize: '13px',
  },
}));

export const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

export const searchIconStyles: SxProps<Theme> = {
  fontSize: 18,
  color: 'primary.main',
};

export const searchButtonStyles: SxProps<Theme> = {
  height: '36px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
};

export const RefreshButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
  textTransform: 'none',
  fontWeight: 600,
  flex: 1,
  [theme.breakpoints.up('md')]: {
    flex: 'none',
  },
}));

export const FinalizeButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  flex: 1,
  [theme.breakpoints.up('md')]: {
    flex: 'none',
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: 'none',
  },
}));

export const EntityContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const EntitySectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: '4px 4px 0 0',
  border: `1px solid ${theme.palette.divider}`,
  borderBottom: 'none',
}));

export const EntityTitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ExpandedContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
}));

export const SubSectionWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
}));

export const SubSectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

export const PostingItemBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.grey[100]}`,
}));

export const NoColumnsBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.spacing(1),
}));
