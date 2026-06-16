import { styled } from '@mui/material/styles';
import { Box, Card, Typography, Button, TypographyProps, ButtonProps } from '@mui/material';

export const TermsBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  backgroundImage: `radial-gradient(at 0% 0%, ${theme.palette.grey[50]} 0, transparent 50%), 
                    radial-gradient(at 100% 100%, ${theme.palette.grey[50]} 0, transparent 50%)`,
  paddingBottom: theme.spacing(8),
}));

export const TermsCard = styled(Card)(({ theme }) => ({
  padding: 0,
  overflow: 'hidden',
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
  backgroundColor: theme.palette.background.paper,
}));

export const TermsHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.background.paper} 100%)`,
}));

export const TermsContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 8),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4, 3),
  },
}));

export const SectionTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(2),
}));

export const SectionText = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: 1.8,
  marginBottom: theme.spacing(2.5),
  fontSize: '0.95rem',
}));

export const BackButton = styled(Button)<ButtonProps>(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.text.secondary,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));

export const PageWrapper = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

export const TermsTitle = styled(Typography)<TypographyProps>({
  fontWeight: 800,
});

export const IntroText = styled(SectionText)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontStyle: 'italic',
  fontSize: '1.1rem',
  color: theme.palette.text.primary,
}));

export const TermsNotice = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  padding: theme.spacing(4),
  backgroundColor: theme.palette.action.hover,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

export const NoticeText = styled(Typography)<TypographyProps>({
  lineHeight: 1.7,
});

export const CopyrightWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  textAlign: 'center',
}));

export const CopyrightText = styled(Typography)<TypographyProps>({
  letterSpacing: '0.05em',
  fontWeight: 600,
});
