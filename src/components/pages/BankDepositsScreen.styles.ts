import { styled } from '@mui/material/styles';
import { Box, Typography, Chip, TextField, Button } from '@mui/material';

export const ScreenWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 3, 4, 3),
}));

export const ScreenHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const EntityChip = styled(Chip)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? 'rgba(107, 153, 196, 0.7)' : '#f1f5f9',
  color: isSelected ? '#fff' : 'rgb(100, 116, 139)',
  fontWeight: 600,
  fontSize: '12px',
  marginBottom: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: isSelected ? 'rgba(107, 153, 196, 0.8)' : '#e2e8f0',
  }
}));

export const ToolbarWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
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
  backgroundColor: '#fff',
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
  backgroundColor: '#fff',
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
  backgroundColor: 'rgba(107, 153, 196, 0.7)',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  flex: 1,
  [theme.breakpoints.up('md')]: {
    flex: 'none',
  },
  '&:hover': {
    backgroundColor: 'rgba(107, 153, 196, 0.8)',
    boxShadow: 'none',
  }
}));

export const EntitySectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: '#f1f5f9',
  borderRadius: '4px 4px 0 0',
  border: '1px solid #e2e8f0',
  borderBottom: 'none'
}));

export const ExpandedContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: theme.spacing(1)
}));

export const SubSectionWrapper = styled(Box)(({ theme }) => ({
  border: '1px solid #e2e8f0',
  borderRadius: theme.spacing(1)
}));

export const SubSectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderBottom: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc'
}));

export const PostingItemBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: '#f8fafc',
  borderRadius: theme.spacing(1),
  border: '1px solid #f1f5f9'
}));
