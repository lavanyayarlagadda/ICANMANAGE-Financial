import { styled } from '@mui/material/styles';
import { Box, TableCell } from '@mui/material';

export const ContainerBox = styled(Box)(() => ({
  width: '100%',
  overflow: 'hidden',
}));

export const CheckboxHeaderCell = styled(TableCell)(({ theme }) => ({
  width: 48,
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}));

export const StandardHeaderCell = styled(TableCell)(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}));

export const CheckboxBodyCell = styled(TableCell)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

export const StandardBodyCell = styled(TableCell)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));
