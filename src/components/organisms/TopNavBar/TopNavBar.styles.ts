import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Box, TextField, Menu, MenuItem, Typography, Avatar } from '@mui/material';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  zIndex: theme.zIndex.drawer + 1,
  pointerEvents: 'none',
}));

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'space-between',
  minHeight: 56,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  pointerEvents: 'none',
  [theme.breakpoints.up('md')]: {
    minHeight: 64,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

export const LeftSectionBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  pointerEvents: 'auto',
}));

export const RightSectionBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(2),
  },
}));

export const TenantSelectBox = styled(Box)(({ theme }) => ({
  minWidth: 60,
  maxWidth: 100,
  marginLeft: theme.spacing(0.5),
  pointerEvents: 'auto',
  [theme.breakpoints.up('sm')]: {
    minWidth: 160,
    maxWidth: 'none',
    marginLeft: theme.spacing(2),
  },
}));

export const StyledTenantSelect = styled(TextField)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.85rem',
  fontWeight: 600,
  backgroundColor: theme.palette.action.hover,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.light,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  pointerEvents: 'auto',
}));

export const UserProfileBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginLeft: theme.spacing(2),
  cursor: 'pointer',
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  '&:hover': { backgroundColor: theme.palette.action.hover },
  pointerEvents: 'auto',
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  backgroundColor: theme.palette.primary.main,
  fontSize: '0.9rem',
}));

export const UserNameTypography = styled(Typography)({
  fontWeight: 600,
  lineHeight: 1.2,
});

export const UserCompanyTypography = styled(Typography)({
  lineHeight: 1,
});

export const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    minWidth: 260,
    marginTop: theme.spacing(1),
    borderRadius: (theme.shape.borderRadius as number) * 2,
  },
}));

export const MenuHeaderBox = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}));

export const MenuHeaderNameTypography = styled(Typography)({
  fontWeight: 600,
});

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}));

export const MenuSectionHeaderBox = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

export const MenuSectionTitleTypography = styled(Typography)({
  fontWeight: 600,
});
