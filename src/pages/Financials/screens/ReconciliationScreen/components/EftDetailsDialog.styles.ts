import { styled } from '@mui/material/styles';
import {
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
} from '@mui/material';

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(2.5),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  backgroundColor: theme.palette.grey[50],
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const HeaderLeftBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  flex: 1,
  marginTop: theme.spacing(0.5),
}));

export const IconWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: '10px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  display: 'flex',
}));

export const HeaderTitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  color: theme.palette.text.primary,
  lineHeight: 1.2,
}));

export const HeaderSubtitleText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 600,
  display: 'block',
  marginTop: theme.spacing(0.5),
}));

export const SubtitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
}));

export const ReconcileSpan = styled('span')(({ theme }) => ({
  color: theme.palette.success.main,
  fontWeight: 800,
}));

export const CloseButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  flexShrink: 0,
}));

export const StyledDivider = styled(Divider)(() => ({
  opacity: 0.5,
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const SearchBoxWrapper = styled(Box)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
  borderRadius: '12px',
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
}));

export const LabelText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(1),
  display: 'block',
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
}));

export const ActionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  height: '100%',
}));

export const StyledSearchButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 800,
  boxShadow: 'none',
}));

export const StyledSubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  height: '40px',
  textTransform: 'none',
  fontWeight: 800,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export const SectionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const SectionWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '16px',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

export const SectionSidebarTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'darkColor',
})<{ darkColor: string }>(({ darkColor }) => ({
  fontWeight: 900,
  color: darkColor,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
}));

export const HistoryContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5),
}));

export const HistoryTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  fontWeight: 900,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

import { Grid, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import { ModernUploadZone } from '../ReconciliationScreen.styles';

export const ActionsRowGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  alignItems: 'stretch',
}));

export const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: theme.palette.background.paper,
    fontWeight: 700,
  },
}));

export const UploadZoneWrapper = styled(ModernUploadZone)(({ theme }) => ({
  flex: 1,
  height: '40px',
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  borderStyle: 'solid',
  borderWidth: '1px',
}));

export const StyledCloudUploadIcon = styled(CloudUploadIcon)(() => ({
  fontSize: 20,
}));

export const UploadedFileNameTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'hasFile',
})<{ hasFile: boolean }>(({ theme, hasFile }) => ({
  fontWeight: 700,
  color: hasFile ? theme.palette.success.main : theme.palette.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const StyledDescriptionIcon = styled(DescriptionIcon)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.primary.main,
}));
