import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography } from '@mui/material';

export const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'customBg' && prop !== 'defaultBg',
})<{ customBg?: string; defaultBg: string }>(({ customBg, defaultBg }) => ({
  backgroundColor: customBg || defaultBg,
  height: '100%',
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
  '&:last-child': {
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      paddingBottom: theme.spacing(3),
    },
  },
  textAlign: 'center',
}));

export const TitleTypography = styled(Typography)(() => ({
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 600,
  marginBottom: '8px',
  display: 'block',
}));

export const ValueTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'valueColor' && prop !== 'hasSubtitle',
})<{ valueColor: string; hasSubtitle: boolean }>(({ valueColor, hasSubtitle }) => ({
  fontWeight: 700,
  color: valueColor,
  marginBottom: hasSubtitle ? '4px' : '0px',
}));

export const SubtitleTypography = styled(Typography)(() => ({
  fontWeight: 600,
}));
