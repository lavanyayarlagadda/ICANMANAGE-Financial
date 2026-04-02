import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TableDescription } from '@/services/descriptionService';
import { themeConfig } from '@/theme/themeConfig';

interface DictionaryDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedField: TableDescription | null;
}

const DictionaryDrawer: React.FC<DictionaryDrawerProps> = ({
  open,
  onClose,
  selectedField,
}) => {
  if (!selectedField) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer,
        '& .MuiBackdrop-root': { 
          top: { xs: '56px', md: '64px' } 
        } 
      }}
        PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          height: { xs: 'calc(100% - 56px)', md: 'calc(100% - 64px)' },
          top: { xs: '56px', md: '64px' },
          boxShadow: themeConfig.shadows.dropdown,
        }
      }}
    >
      <Box sx={{
        p: { xs: 2.5, sm: 4 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexShrink: 0,
          pb: 1,
          borderBottom: { xs: `1px solid ${themeConfig.colors.dictionaryDrawer.bgAlt}`, sm: 'none' }
        }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: themeConfig.colors.dictionaryDrawer.textHeading, fontSize: '1.2rem' }}>
            Description
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              bgcolor: themeConfig.colors.dictionaryDrawer.bgAlt,
              color: themeConfig.colors.dictionaryDrawer.textMuted,
              '&:hover': { bgcolor: themeConfig.colors.dictionaryDrawer.bgHover, color: themeConfig.colors.dictionaryDrawer.textHeading },
              width: 36,
              height: 36
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          pr: 1,
          mr: -1,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': { bgcolor: themeConfig.colors.dictionaryDrawer.bgHover, borderRadius: 3 }
        }}>
          <Box sx={{
            bgcolor: themeConfig.colors.dictionaryDrawer.bg,
            p: 4,
            borderRadius: '40px',
            border: `1px solid ${themeConfig.colors.dictionaryDrawer.border}`,
            position: 'relative',
            mb: 4
          }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: themeConfig.colors.dictionaryDrawer.textAccent,
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '0.85rem',
                mb: 2.5
              }}
            >
              {selectedField.heading}
            </Typography>

            <Divider sx={{ mb: 3, borderColor: themeConfig.colors.dictionaryDrawer.bgAlt, borderBottomWidth: '1px' }} />

            <Typography
              variant="body1"
              sx={{
                color: themeConfig.colors.dictionaryDrawer.textBody,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                mb: 3
              }}
            >
              {selectedField.description}
            </Typography>

            {selectedField.usageTip && (
              <Box sx={{
                mt: 4,
                p: 3,
                bgcolor: themeConfig.colors.dictionaryDrawer.bgTip,
                borderRadius: '24px',
              }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: themeConfig.colors.dictionaryDrawer.textAccent, mb: 0.5 }}>
                  Usage Tip:
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: themeConfig.colors.dictionaryDrawer.textAccent, lineHeight: 1.5 }}>
                  {selectedField.usageTip}
                </Typography>
              </Box>
            )}
          </Box>

          {selectedField.statuses && selectedField.statuses.length > 0 && (
            <Box sx={{ px: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: themeConfig.colors.dictionaryDrawer.textHeading,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Box component="span" sx={{ width: 4, height: 16, bgcolor: themeConfig.colors.dictionaryDrawer.textAccent, borderRadius: 1 }} />
                STATUS EXPLANATIONS
              </Typography>
              {selectedField.statuses.map((status, idx) => (
                <Box key={idx} sx={{ mb: 3, pl: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: themeConfig.colors.dictionaryDrawer.textNavy, mb: 0.5 }}>
                    {status.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: themeConfig.colors.dictionaryDrawer.textMuted, lineHeight: 1.6 }}>
                    {status.explanation}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{
          mt: 'auto',
          textAlign: 'center',
          pt: 3,
          pb: 2,
          px: 4,
          flexShrink: 0,
          borderTop: `1px solid ${themeConfig.colors.dictionaryDrawer.bgAlt}`,
          bgcolor: themeConfig.colors.dictionaryDrawer.bgFooter,
          mx: -4,
          mb: -4,
        }}>
          <Typography variant="caption" sx={{ color: themeConfig.colors.dictionaryDrawer.textLight, display: 'block', mb: 1, fontWeight: 500 }}>
            Need more help? Contact your administrator.
          </Typography>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, bgcolor: themeConfig.colors.dictionaryDrawer.bg, borderRadius: '12px', border: `1px solid ${themeConfig.colors.dictionaryDrawer.border}` }}>
            <Box sx={{ width: 6, height: 6, bgcolor: themeConfig.colors.dictionaryDrawer.textAccent, borderRadius: '50%' }} />
            <Typography variant="caption" sx={{ color: themeConfig.colors.dictionaryDrawer.textMuted, fontWeight: 600 }}>
              ICANMANAGE Support
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DictionaryDrawer;
