import { styled } from '@mui/material/styles';
import { Grid, Card, Box, Typography } from '@mui/material';
import { deltaColor } from '../helpers/depositReconciliationHelpers';

export const StyledGridContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StyledCard = styled(Card)({
  height: '100%',
});

export const HeaderBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8, // MUI spacing unit = 8px
});

export const ValueBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: 8,
  marginTop: theme.spacing(0.4),
}));

export const TitleTypography = styled(Typography)({
  fontWeight: 700,
});

export const DeltaTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'delta',
})<{ delta: number | string }>(({ theme, delta }) => ({
  color: deltaColor(
    delta,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.text.secondary,
  ),
  fontWeight: 700,
}));

export const BadgeDot = styled(Box)({
  width: 8,
  height: 8,
  borderRadius: '50%',
});

export const MarginBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));
