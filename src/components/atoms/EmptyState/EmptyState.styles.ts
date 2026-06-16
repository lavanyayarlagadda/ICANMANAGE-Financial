import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const ContainerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px', // or theme.shape.borderRadius * 2
}));

export const IconWrapper = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: '50%',
  backgroundColor: theme.palette.grey[50],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    fontSize: 32,
    color: theme.palette.text.disabled,
  },
}));

export const StyledTypographyHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const StyledTypographyDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  maxWidth: 400,
}));

export const ClearFiltersButton = styled(Button)(() => ({
  borderRadius: themeConfig.spacing.borderRadius.md,
  textTransform: 'none',
  fontWeight: 600,
}));
