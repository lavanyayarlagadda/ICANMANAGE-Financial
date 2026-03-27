import { styled } from '@mui/material/styles';
import { Typography, TypographyProps, Box } from '@mui/material';

export const ScreenHeader = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
}));

export const ScreenSubtitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

export const SectionTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 700,
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
}));

export const MonospaceText = styled(Typography)<TypographyProps>({
  fontFamily: 'monospace',
});

export const ProviderText = styled(Typography)<TypographyProps>({
  fontWeight: 600,
});
