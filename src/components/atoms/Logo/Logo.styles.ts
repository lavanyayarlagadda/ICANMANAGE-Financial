import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const ContainerBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px', // gap: 1.5
}));

export const ImageContainer = styled(Box)(() => ({
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledImg = styled('img', {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed: boolean }>(({ collapsed }) => ({
  width: collapsed ? 60 : 110,
  transition: 'width 0.2s ease-in-out',
}));
