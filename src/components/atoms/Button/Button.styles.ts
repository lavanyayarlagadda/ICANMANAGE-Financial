import { styled } from '@mui/material/styles';
import { Button as MuiButton } from '@mui/material';

export const StyledMuiButton = styled(MuiButton)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightMedium,
}));
