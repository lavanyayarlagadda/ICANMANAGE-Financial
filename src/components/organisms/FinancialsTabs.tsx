import React, { useEffect } from 'react';
import { Box, Typography, useTheme, useMediaQuery, Select, MenuItem, SelectChangeEvent, FormControl } from '@mui/material';
import Button from '@/components/atoms/Button';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAppSelector, useAppDispatch } from '@/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { setActiveTab, setActiveSubTab } from '@/store/slices/uiSlice';
import { mainTabs, transactionSubTabs, statementsSubTabs, varianceSubTabs, trendsSubTabs } from './FinancialsTabs.config';

interface FinancialsTabsProps {
  onPrint?: () => void;
  onReload?: () => void;
  onExportWizard?: () => void;
  showPrint?: boolean;
  showReload?: boolean;
  showExportWizard?: boolean;
}

const FinancialsTabs: React.FC<FinancialsTabsProps> = ({
  onPrint,
  onReload,
  onExportWizard,
  showPrint,
  showReload,
  showExportWizard
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { activeTab, activeSubTab, isReloading } = useAppSelector((s) => s.ui);
  const user = useAppSelector((s) => s.auth.user);
  const { selectedTenantId } = useAppSelector((s) => s.tenant);
  const isMindPath =
    user?.company?.toLowerCase() === 'mindpath' ||
    selectedTenantId?.toLowerCase() === 'mindpath';
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const canShowActions = activeTab === 0 || activeTab === 2 || activeTab === 5 || activeTab === 3;
  const shouldShowPrint = showPrint ?? canShowActions;
  const shouldShowReload = showReload ?? canShowActions;
  const shouldShowExport = showExportWizard ?? canShowActions;

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/all-transactions') || path.includes('/payments') || path.includes('/recoupments') || path.includes('/other-adjustments') || path.includes('/pip')) {
      dispatch(setActiveTab(0));
      const subIndex = transactionSubTabs.findIndex(st => path === st.path);
      if (subIndex !== -1) {
        dispatch(setActiveSubTab(subIndex));
      }
    } else if (path.includes('/statements')) {
      dispatch(setActiveTab(2));
      if (path.includes('/pip')) dispatch(setActiveSubTab(0));
      else if (path.includes('/forward-balance')) dispatch(setActiveSubTab(1));
      else if (path.includes('/suspense-accounts')) dispatch(setActiveSubTab(2));
    } else if (path.includes('/variance-analysis')) {
      dispatch(setActiveTab(3));
      if (path.includes('/fee-schedule')) dispatch(setActiveSubTab(0));
      else if (path.includes('/payment')) dispatch(setActiveSubTab(1));
    } else if (path.includes('/trends-forecast')) {
      dispatch(setActiveTab(4));
      if (path.includes('/forecast')) dispatch(setActiveSubTab(0));
      else if (path.includes('/summary')) dispatch(setActiveSubTab(1));
      else if (path.includes('/payer-performance')) dispatch(setActiveSubTab(2));
    } else if (path.includes('/calendar')) {
      dispatch(setActiveTab(5));
    }
  }, [location.pathname, dispatch, isMindPath]);

  const handleMainTabChange = (index: number, path: string) => {
    dispatch(setActiveTab(index));
    let finalPath = path;
    if (index === 2 && isMindPath) {
      finalPath = '/financials/statements/forward-balance';
    }
    navigate(finalPath);
  };

  const handleSubTabChange = (index: number, path: string) => {
    dispatch(setActiveSubTab(index));
    navigate(path);
  };

  const hasSubTabs = (activeTab === 0) || (activeTab === 2) || (activeTab === 3) || (activeTab === 4);
  const hasActions = shouldShowPrint || shouldShowReload || shouldShowExport;
  const showSubTabsRow = hasSubTabs || hasActions;

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{
        px: 2,
        py: 1.5,
        display: 'flex',
        flexDirection: isTablet ? 'column' : 'row',
        alignItems: isTablet ? 'flex-start' : 'center',
        backgroundColor: '#fff',
        borderBottom: `1px solid ${theme.palette.divider}`,
        gap: isTablet ? 1.5 : 0
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mr: isTablet ? 0 : 4, color: 'rgb(10, 22, 40)', fontSize: '20px', mb: isTablet ? 0.5 : 0 }}>
          Financials
        </Typography>

        <Box sx={{ width: isTablet ? '100%' : 'auto' }}>
          {isTablet ? (
            <FormControl fullWidth size="small">
              <Select
                value={activeTab}
                onChange={(e: SelectChangeEvent<number>) => {
                  const val = Number(e.target.value);
                  const tab = mainTabs.find(t => t.id === val);
                  if (tab) handleMainTabChange(tab.id, tab.path);
                }}
                sx={{
                  backgroundColor: 'rgba(240, 244, 248, 0.8)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider }
                }}
              >
                {mainTabs
                  .filter(tab => !(tab.id === 2 && isMindPath))
                  .map((tab) => (
                    <MenuItem key={tab.id} value={tab.id} sx={{ fontWeight: 500, fontSize: '14px' }}>
                      {tab.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          ) : (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {mainTabs
                .filter(tab => !(tab.id === 2 && isMindPath))
                .map((tab) => {
                  const isActive = activeTab === tab.id;
                  let path = tab.path;
                  if (tab.id === 2 && !isMindPath) {
                    path = '/financials/statements';
                  }
                  return (
                    <Box
                      key={tab.id}
                      onClick={() => handleMainTabChange(tab.id, path)}
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: isActive ? 'rgba(107, 153, 196, 0.6)' : 'rgba(240, 244, 248, 0.8)',
                        color: isActive ? '#fff' : 'rgb(100, 116, 139)',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: isActive ? 'rgba(107, 153, 196, 0.7)' : 'rgba(226, 232, 240, 1)',
                        }
                      }}
                    >
                      {tab.label}
                    </Box>
                  );
                })}
            </Box>
          )}
        </Box>
      </Box>

      {showSubTabsRow && (
        <Box sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'flex-start' : 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          backgroundColor: '#fcfcfc',
          gap: 2
        }}>
          <Box sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            width: isMobile ? '100%' : 'auto'
          }}>
            {activeTab === 0 && transactionSubTabs.map((subTab) => {
              const isActive = activeSubTab === subTab.id;
              return (
                <Box
                  key={subTab.id}
                  onClick={() => handleSubTabChange(subTab.id, subTab.path)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? 'rgba(107, 153, 196, 0.7)' : 'transparent',
                    color: isActive ? '#fff' : 'rgb(100, 116, 139)',
                    fontWeight: 500,
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: isActive ? 'rgba(107, 153, 196, 0.8)' : 'rgba(241, 245, 249, 1)',
                    }
                  }}
                >
                  {subTab.label}
                </Box>
              );
            })}
            {activeTab === 2 && statementsSubTabs
              .filter(subTab => !(subTab.label === 'PIP Statements' && isMindPath))
              .map((subTab) => {
                const isActive = activeSubTab === subTab.id;
                return (
                  <Box
                    key={subTab.id}
                    onClick={() => handleSubTabChange(subTab.id, subTab.path)}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      backgroundColor: isActive ? 'rgba(107, 153, 196, 0.7)' : 'transparent',
                      color: isActive ? '#fff' : 'rgb(100, 116, 139)',
                      fontWeight: 500,
                      fontSize: '13px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: isActive ? 'rgba(107, 153, 196, 0.8)' : 'rgba(241, 245, 249, 1)',
                      }
                    }}
                  >
                    {subTab.label}
                  </Box>
                );
              })}
            {activeTab === 3 && varianceSubTabs.map((subTab) => {
              const isActive = activeSubTab === subTab.id;
              return (
                <Box
                  key={subTab.id}
                  onClick={() => handleSubTabChange(subTab.id, subTab.path)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? 'rgba(107, 153, 196, 0.7)' : 'transparent',
                    color: isActive ? '#fff' : 'rgb(100, 116, 139)',
                    fontWeight: 500,
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: isActive ? 'rgba(107, 153, 196, 0.8)' : 'rgba(241, 245, 249, 1)',
                    }
                  }}
                >
                  {subTab.label}
                </Box>
              );
            })}
            {activeTab === 4 && trendsSubTabs.map((subTab) => {
              const isActive = activeSubTab === subTab.id;
              return (
                <Box
                  key={subTab.id}
                  onClick={() => handleSubTabChange(subTab.id, subTab.path)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? 'rgba(107, 153, 196, 0.7)' : 'transparent',
                    color: isActive ? '#fff' : 'rgb(100, 116, 139)',
                    fontWeight: 500,
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: isActive ? 'rgba(107, 153, 196, 0.8)' : 'rgba(241, 245, 249, 1)',
                    }
                  }}
                >
                  {subTab.label}
                </Box>
              );
            })}
          </Box>

          <Box sx={{
            display: 'flex',
            gap: 1.5,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'flex-start' : 'flex-end'
          }}>
            {shouldShowPrint && (
              <Button
                size="small"
                variant="outlined"
                onClick={onPrint}
                startIcon={<PrintIcon sx={{ fontSize: 18, color: '#94a3b8' }} />}
                sx={{
                  color: 'rgb(71, 85, 105)',
                  borderColor: '#e2e8f0',
                  borderRadius: '6px',
                  textTransform: 'none',
                  px: 2,
                  py: 0.7,
                  fontSize: '13px',
                  fontWeight: 500,
                  backgroundColor: '#fff',
                  flex: isMobile ? 1 : 'unset',
                  minWidth: isMobile ? 'calc(50% - 12px)' : 'unset',
                  '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' }
                }}
              >
                Print
              </Button>
            )}

            {shouldShowReload && (
              <Button
                size="small"
                variant="outlined"
                onClick={onReload}
                disabled={isReloading}
                startIcon={<RefreshIcon sx={{ fontSize: 18 }} />}
                sx={{
                  color: '#000',
                  borderColor: '#000',
                  borderWidth: 1.5,
                  borderRadius: '6px',
                  textTransform: 'none',
                  px: 2,
                  py: 0.7,
                  fontSize: '13px',
                  fontWeight: 700,
                  flex: isMobile ? 1 : 'unset',
                  minWidth: isMobile ? 'calc(50% - 12px)' : 'unset',
                  '&:hover': { borderWidth: 1.5, bgcolor: 'rgba(0,0,0,0.04)' }
                }}
              >
                Reload
              </Button>
            )}

            {shouldShowExport && (
              <Button
                size="small"
                variant="contained"
                onClick={onExportWizard}
                startIcon={null}
                sx={{
                  bgcolor: '#d97706',
                  color: '#fff',
                  borderRadius: '6px',
                  textTransform: 'none',
                  px: 3,
                  py: 0.7,
                  fontSize: '13px',
                  fontWeight: 600,
                  width: isMobile ? '100%' : 'unset',
                  '&:hover': { bgcolor: '#b45309' }
                }}
              >
                Export Wizard
              </Button>
            )}
          </Box>
        </Box>
      )}

    </Box>
  );
};

export default FinancialsTabs;
