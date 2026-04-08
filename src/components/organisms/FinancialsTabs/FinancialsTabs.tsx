import React from 'react';
import { Box, Typography, useTheme, useMediaQuery, Select, MenuItem, SelectChangeEvent, FormControl, Tab, Tabs, alpha } from '@mui/material';
import Button from '@/components/atoms/Button/Button';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useFinancialsTabs, mainTabs, transactionSubTabs, statementsSubTabs, varianceSubTabs, trendsSubTabs } from './FinancialsTabs.hook';
import { themeConfig } from '@/theme/themeConfig';
import * as styles from './FinancialsTabs.styles';

interface FinancialsTabsProps {
  onPrint?: () => void;
  onReload?: () => void;
  onExportWizard?: () => void;
  showPrint?: boolean;
  showReload?: boolean;
  showExportWizard?: boolean;
}

const FinancialsTabs: React.FC<FinancialsTabsProps> = ({ onPrint, onReload, onExportWizard, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const {
    activeTab,
    activeSubTab,
    isReloading,
    isMindPath,
    shouldShowPrint,
    shouldShowReload,
    shouldShowExport,
    showSubTabsRow,
    filteredMainTabs,
    filteredTransactionSubTabs,
    filteredStatementsSubTabs,
    filteredVarianceSubTabs,
    filteredTrendsSubTabs,
    handleMainTabChange,
    handleSubTabChange,
    getMenuStatus,
  } = useFinancialsTabs(props);

  return (
    <Box sx={styles.containerStyles}>
      <Box sx={styles.mainTabsRowStyles(theme, isTablet)}>
        <Typography variant="h5" sx={{ ...styles.mainTitleStyles, mr: isTablet ? 0 : 4, mb: isTablet ? 0.5 : 0, flexShrink: 0 }}>
          Financials
        </Typography>

        <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', ml: isTablet ? 0 : 2 }}>
          {isMobile ? (
            <FormControl fullWidth size="small">
              <Select
                value={activeTab}
                onChange={(e: SelectChangeEvent<number>) => {
                  const val = Number(e.target.value);
                  const tab = filteredMainTabs.find(t => t.id === val);
                  if (tab) handleMainTabChange(tab.id, tab.path);
                }}
                sx={styles.tabletSelectStyles(theme)}
              >
                {filteredMainTabs.map((tab) => (
                  <MenuItem
                    key={tab.id}
                    value={tab.id}
                    disabled={getMenuStatus(tab.label, 'Financials') === 'Disabled'}
                    sx={{ fontWeight: 500, fontSize: '14px' }}
                  >
                    {tab.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Tabs
              value={activeTab}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              onChange={(_, val) => {
                const tab = filteredMainTabs.find(t => t.id === val);
                if (tab) handleMainTabChange(tab.id, tab.path);
              }}
              sx={{
                width: '100%',
                minHeight: '40px',
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTabs-flexContainer': { gap: 0.5 },
                '& .MuiTabs-scroller': { overflow: 'hidden !important' },
                '& .MuiTabs-scrollButtons': {
                  width: '32px',
                  borderRadius: '4px',
                  backgroundColor: alpha(themeConfig.colors.slate[100], 0.8),
                  mx: 0.5,
                  color: themeConfig.colors.primary,
                  transition: 'all 0.2s',
                  '&:hover': { backgroundColor: themeConfig.colors.slate[200] },
                  '&.Mui-disabled': { display: 'none' }
                },
                '& .MuiTab-root': {
                  minHeight: '40px',
                  minWidth: 'auto',
                  p: 0,
                  textTransform: 'none',
                  opacity: 1
                }
              }}
            >
              {filteredMainTabs.map((tab) => {
                const isDisabled = getMenuStatus(tab.label, 'Financials') === 'Disabled';
                return (
                  <Tab
                    key={tab.id}
                    value={tab.id}
                    disabled={isDisabled}
                    label={
                      <Box sx={styles.mainTabItemStyles(activeTab === tab.id, isDisabled)}>
                        {tab.label}
                      </Box>
                    }
                    disableRipple
                  />
                );
              })}
            </Tabs>
          )}
        </Box>
      </Box>

      {showSubTabsRow && (
        <Box sx={styles.subTabsRowStyles(isMobile)}>
          <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <Tabs
              value={activeSubTab}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              onChange={(_, val) => {
                const currentSubTabs =
                  activeTab === 0 ? filteredTransactionSubTabs :
                    activeTab === 2 ? filteredStatementsSubTabs :
                      activeTab === 3 ? filteredVarianceSubTabs :
                        activeTab === 4 ? filteredTrendsSubTabs : [];

                const subTab = currentSubTabs.find(st => st.id === val);
                if (subTab) handleSubTabChange(subTab.id, subTab.path);
              }}
              sx={{
                width: '100%',
                minHeight: 'auto',
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTabs-flexContainer': { gap: 1 },
                '& .MuiTabs-scrollButtons': {
                  width: '28px',
                  borderRadius: '4px',
                  backgroundColor: alpha(themeConfig.colors.slate[100], 0.3),
                  transition: 'all 0.2s',
                  '&.Mui-disabled': { display: 'none' }
                },
                '& .MuiTab-root': {
                  minHeight: 'auto',
                  minWidth: 'auto',
                  p: 0,
                  textTransform: 'none',
                  opacity: 1
                }
              }}
            >
              {activeTab === 0 && filteredTransactionSubTabs.map((subTab) => {
                const isDisabled = getMenuStatus(subTab.label, 'Transactions') === 'Disabled';
                return (
                  <Tab
                    key={subTab.id}
                    value={subTab.id}
                    disabled={isDisabled}
                    label={
                      <Box sx={styles.subTabItemStyles(activeSubTab === subTab.id, isDisabled)}>
                        {subTab.label}
                      </Box>
                    }
                    disableRipple
                  />
                );
              })}
              {activeTab === 2 && filteredStatementsSubTabs.map((subTab) => {
                const isDisabled = getMenuStatus(subTab.label, 'Statements') === 'Disabled';
                return (
                  <Tab
                    key={subTab.id}
                    value={subTab.id}
                    disabled={isDisabled}
                    label={
                      <Box sx={styles.subTabItemStyles(activeSubTab === subTab.id, isDisabled)}>
                        {subTab.label}
                      </Box>
                    }
                    disableRipple
                  />
                );
              })}
              {activeTab === 3 && filteredVarianceSubTabs.map((subTab) => {
                const isDisabled = getMenuStatus(subTab.label, 'Variance Analysis') === 'Disabled';
                return (
                  <Tab
                    key={subTab.id}
                    value={subTab.id}
                    disabled={isDisabled}
                    label={
                      <Box sx={styles.subTabItemStyles(activeSubTab === subTab.id, isDisabled)}>
                        {subTab.label}
                      </Box>
                    }
                    disableRipple
                  />
                );
              })}
              {activeTab === 4 && filteredTrendsSubTabs.map((subTab) => {
                const isDisabled = getMenuStatus(subTab.label, 'Trends & Forecast') === 'Disabled';
                return (
                  <Tab
                    key={subTab.id}
                    value={subTab.id}
                    disabled={isDisabled}
                    label={
                      <Box sx={styles.subTabItemStyles(activeSubTab === subTab.id, isDisabled)}>
                        {subTab.label}
                      </Box>
                    }
                    disableRipple
                  />
                );
              })}
            </Tabs>
          </Box>

          <Box sx={styles.actionsGroupStyles(isMobile)}>
            {shouldShowPrint && (
              <Button
                size="small"
                variant="outlined"
                onClick={onPrint}
                startIcon={<PrintIcon sx={{ fontSize: 18, color: themeConfig.colors.slate[400] }} />}
                sx={styles.printButtonStyles(isMobile)}
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
                sx={styles.reloadButtonStyles(isMobile)}
              >
                Reload
              </Button>
            )}
            {shouldShowExport && (
              <Button
                size="small"
                variant="contained"
                onClick={onExportWizard}
                sx={styles.exportButtonStyles(isMobile)}
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

