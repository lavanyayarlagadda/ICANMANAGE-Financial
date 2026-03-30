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
          boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
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
          borderBottom: { xs: '1px solid #f1f5f9', sm: 'none' }
        }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.2rem' }}>
            Description
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              bgcolor: '#f1f5f9',
              color: '#64748b',
              '&:hover': { bgcolor: '#e2e8f0', color: '#1e293b' },
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
          '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: 3 }
        }}>
          <Box sx={{
            bgcolor: '#fff',
            p: 4,
            borderRadius: '40px',
            border: '1px solid #e2e8f0',
            position: 'relative',
            mb: 4
          }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: '#3b82f6',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '0.85rem',
                mb: 2.5
              }}
            >
              {selectedField.heading}
            </Typography>

            <Divider sx={{ mb: 3, borderColor: '#f1f5f9', borderBottomWidth: '1px' }} />

            <Typography
              variant="body1"
              sx={{
                color: '#475569',
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
                bgcolor: '#f0f7ff',
                borderRadius: '24px',
              }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6', mb: 0.5 }}>
                  Usage Tip:
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#3b82f6', lineHeight: 1.5 }}>
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
                  color: '#1e293b',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Box component="span" sx={{ width: 4, height: 16, bgcolor: '#3b82f6', borderRadius: 1 }} />
                STATUS EXPLANATIONS
              </Typography>
              {selectedField.statuses.map((status, idx) => (
                <Box key={idx} sx={{ mb: 3, pl: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 0.5 }}>
                    {status.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
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
          borderTop: '1px solid #f1f5f9',
          bgcolor: '#fafafa',
          mx: -4,
          mb: -4,
        }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1, fontWeight: 500 }}>
            Need more help? Contact your administrator.
          </Typography>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Box sx={{ width: 6, height: 6, bgcolor: '#3b82f6', borderRadius: '50%' }} />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              ICANMANAGE Support
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DictionaryDrawer;
