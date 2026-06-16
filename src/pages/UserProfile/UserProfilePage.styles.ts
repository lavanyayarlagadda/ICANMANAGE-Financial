import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Card,
  Tabs,
  TextField,
  Button,
  Alert,
  IconButton,
  Select,
} from '@mui/material';
import { themeConfig } from '@/theme';

export const PageContainer = styled(Box)({
  maxWidth: 800,
  margin: '0 auto',
  paddingTop: '16px',
  paddingBottom: '16px',
});

export const HeaderBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
});

export const TabsContainer = styled(Box)({
  backgroundColor: themeConfig.colors.surfaceAlt,
  borderRadius: 8,
  padding: '4px',
  marginBottom: '24px',
});

export const StyledTabs = styled(Tabs)({
  minHeight: 'unset',
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTab-root': {
    paddingTop: '8px',
    paddingBottom: '8px',
    minHeight: 'unset',
    textTransform: 'none',
    fontWeight: 600,
    color: themeConfig.colors.text.secondary,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    '&.Mui-selected': {
      color: themeConfig.colors.text.primary,
      backgroundColor: themeConfig.colors.surface,
      boxShadow: `0 1px 3px ${themeConfig.colors.overlay.black}`,
    },
  },
});

export const StyledCard = styled(Card)({
  padding: '24px',
  border: `1px solid ${themeConfig.colors.border}`,
  boxShadow: 'none',
});

export const StyledTextField = styled(TextField)({
  marginBottom: '16px',
  backgroundColor: themeConfig.colors.inputBackground,
});

export const ActionsBox = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const StyledTabPanel = styled(Box)({
  padding: 0,
  marginTop: '16px',
});

export const BackButton = styled(IconButton)({
  marginRight: '8px',
  color: themeConfig.colors.text.primary,
});

export const PageTitle = styled(Typography)({
  fontWeight: 700,
});

export const Subtitle = styled(Typography)({
  textAlign: 'center',
  marginBottom: '16px',
});

export const StyledAlert = styled(Alert)({
  marginBottom: '16px',
});

export const CardTitle = styled(Typography)({
  fontWeight: 600,
  marginBottom: '4px',
});

export const CardSubtitle = styled(Typography)({
  marginBottom: '24px',
});

export const InputLabel = styled(Typography)({
  fontWeight: 600,
  marginBottom: '4px',
});

export const FieldsRow = styled(Box)({
  display: 'flex',
  gap: '16px',
  marginBottom: '8px',
});

export const FieldCol = styled(Box)({
  flex: 1,
});

export const WarningAlert = styled(Alert)({
  marginBottom: '16px',
  marginTop: '8px',
  '& .MuiAlert-message': {
    fontSize: '0.875rem',
  },
});

export const PrimaryButton = styled(Button)({
  backgroundColor: themeConfig.colors.primary,
  '&:disabled': {
    opacity: 0.5,
    backgroundColor: themeConfig.colors.primary,
  },
});

export const NewPasswordField = styled(TextField)({
  marginBottom: '8px',
  backgroundColor: themeConfig.colors.inputBackground,
});

export const ConfirmPasswordField = styled(TextField)({
  marginBottom: '24px',
  backgroundColor: themeConfig.colors.inputBackground,
});

export const CaptionBlock = styled(Typography)({
  display: 'block',
  marginBottom: '16px',
});

export const CaptionBlockBottom = styled(Typography)({
  display: 'block',
  marginBottom: '24px',
});

export const PreferenceHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '4px',
});

export const PreferenceLabel = styled(Typography)({
  fontWeight: 600,
});

export const StyledSelect = styled(Select)({
  marginBottom: '8px',
  backgroundColor: themeConfig.colors.inputBackground,
}) as unknown as typeof Select;
