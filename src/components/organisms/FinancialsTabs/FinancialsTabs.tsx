import React from 'react';
import { Box, Typography, useTheme, useMediaQuery, Select, MenuItem, SelectChangeEvent, FormControl } from '@mui/material';
import Button from '@/components/atoms/Button/Button';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useFinancialsTabs, mainTabs, transactionSubTabs, statementsSubTabs, varianceSubTabs, trendsSubTabs, reconciliationSubTabs } from './FinancialsTabs.hook';
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
    handleMainTabChange,
    handleSubTabChange,
  } = useFinancialsTabs(props);

  return (
    <Box sx={styles.containerStyles}>
      <Box sx={styles.mainTabsRowStyles(theme, isTablet)}>
        <Typography variant="h5" sx={{ ...styles.mainTitleStyles, mr: isTablet ? 0 : 4, mb: isTablet ? 0.5 : 0 }}>
          Financials
        </Typography>

        <Box sx={{ width: isMobile ? '100%' : 'auto' }}>
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
                  <MenuItem key={tab.id} value={tab.id} sx={{ fontWeight: 500, fontSize: '14px' }}>
                    {tab.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {filteredMainTabs.map((tab) => (
                <Box
                  key={tab.id}
                  onClick={() => handleMainTabChange(tab.id, tab.path)}
                  sx={styles.mainTabItemStyles(activeTab === tab.id)}
                >
                  {tab.label}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {showSubTabsRow && (
        <Box sx={styles.subTabsRowStyles(isMobile)}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
            {activeTab === 0 && transactionSubTabs.map((subTab) => (
              <Box
                key={subTab.id}
                onClick={() => handleSubTabChange(subTab.id, subTab.path)}
                sx={styles.subTabItemStyles(activeSubTab === subTab.id)}
              >
                {subTab.label}
              </Box>
            ))}
            {activeTab === 2 && statementsSubTabs
              .filter(subTab => !(subTab.label === 'PIP Statements' && isMindPath))
              .map((subTab) => (
                <Box
                  key={subTab.id}
                  onClick={() => handleSubTabChange(subTab.id, subTab.path)}
                  sx={styles.subTabItemStyles(activeSubTab === subTab.id)}
                >
                  {subTab.label}
                </Box>
              ))}
            {activeTab === 3 && varianceSubTabs.map((subTab) => (
              <Box
                key={subTab.id}
                onClick={() => handleSubTabChange(subTab.id, subTab.path)}
                sx={styles.subTabItemStyles(activeSubTab === subTab.id)}
              >
                {subTab.label}
              </Box>
            ))}
            {activeTab === 4 && trendsSubTabs.map((subTab) => (
              <Box
                key={subTab.id}
                onClick={() => handleSubTabChange(subTab.id, subTab.path)}
                sx={styles.subTabItemStyles(activeSubTab === subTab.id)}
              >
                {subTab.label}
              </Box>
            ))}
            {activeTab === 5 && reconciliationSubTabs.map((subTab) => (
              <Box
                key={subTab.id}
                onClick={() => handleSubTabChange(subTab.id, subTab.path)}
                sx={styles.subTabItemStyles(activeSubTab === subTab.id)}
              >
                {subTab.label}
              </Box>
            ))}
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

