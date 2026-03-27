import { styled } from '@mui/material/styles';
import { Box, Typography, Chip, TextField, Button } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const ScreenWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 3, 4, 3),
}));

export const ScreenHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const EntityChip = styled(Chip)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? themeConfig.colors.tabActive : themeConfig.colors.surfaceAlt,
  color: isSelected ? '#fff' : themeConfig.colors.text.secondary,
  fontWeight: 600,
  fontSize: '12px',
  marginBottom: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: isSelected ? themeConfig.colors.primaryDark : themeConfig.colors.border,
  }
}));

export const ToolbarWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  backgroundColor: themeConfig.colors.background,
  border: `1px solid ${themeConfig.colors.border}`,
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
    fontSize: '13px'
  }
}));

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
  backgroundColor: themeConfig.colors.tabActive,
  color: '#fff',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  flex: 1,
  [theme.breakpoints.up('md')]: {
    flex: 'none',
  },
  '&:hover': {
    backgroundColor: themeConfig.colors.primaryDark,
    boxShadow: 'none',
  }
}));

export const EntitySectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: themeConfig.colors.surfaceAlt,
  borderRadius: '4px 4px 0 0',
  border: `1px solid ${themeConfig.colors.border}`,
  borderBottom: 'none'
}));

export const ExpandedContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${themeConfig.colors.border}`,
  borderRadius: theme.spacing(1)
}));

export const SubSectionWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${themeConfig.colors.border}`,
  borderRadius: theme.spacing(1)
}));

export const SubSectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${themeConfig.colors.border}`,
  backgroundColor: themeConfig.colors.background
}));

export const PostingItemBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: themeConfig.colors.background,
  borderRadius: theme.spacing(1),
  border: `1px solid ${themeConfig.colors.surfaceAlt}`
}));
