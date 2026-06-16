import { styled } from '@mui/material/styles';
import { Menu, MenuItem } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const StyledMenu = styled(Menu)(() => ({
  minWidth: 160,
  boxShadow: themeConfig.shadows.cardHover,
}));

export const ErrorMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.error.main,
}));
