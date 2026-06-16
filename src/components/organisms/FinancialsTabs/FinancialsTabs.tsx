import React from 'react';
import {
  useTheme,
  useMediaQuery,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  Tab,
  Tooltip,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useFinancialsTabs } from './FinancialsTabs.hook';
import {
  Container,
  MainTabsRow,
  MainTitle,
  TabsWrapper,
  TabletSelect,
  StyledTabs,
  MainTabItem,
  SubTabsRow,
  SubTabsWrapper,
  StyledSubTabs,
  SubTabItem,
  ActionsGroup,
  PrintButton,
  ReloadButton,
  ExportButton,
} from './FinancialsTabs.styles';

interface FinancialsTabsProps {
  onPrint?: () => void;
  onReload?: () => void;
  onExportWizard?: () => void;
  showPrint?: boolean;
  showReload?: boolean;
  showExportWizard?: boolean;
  isRestricted?: boolean;
}

const FinancialsTabs: React.FC<FinancialsTabsProps> = ({
  onPrint,
  onReload,
  onExportWizard,
  isRestricted,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const {
    activeTab,
    activeSubTab,
    isReloading,
    shouldShowPrint,
    shouldShowReload,
    shouldShowExport,
    showSubTabsRow,
    hasSubTabs,
    filteredMainTabs,
    currentSubTabs,
    handleMainTabChange,
    handleSubTabChange,
  } = useFinancialsTabs({ ...props, isRestricted });

  return (
    <Container>
      <MainTabsRow isTablet={isTablet}>
        <MainTitle variant="h5" isTablet={isTablet}>
          Financials
        </MainTitle>

        <TabsWrapper isTablet={isTablet}>
          {isMobile ? (
            <FormControl fullWidth size="small">
              <TabletSelect
                value={activeTab}
                onChange={(e: SelectChangeEvent<number>) => {
                  const val = Number(e.target.value);
                  const tab = filteredMainTabs.find((t) => t.id === val);
                  if (tab) handleMainTabChange(tab.id, tab.path);
                }}
              >
                {filteredMainTabs.map((tab) => (
                  <MenuItem key={tab.id} value={tab.id} disabled={tab.status === 'Disabled'}>
                    {tab.label}
                  </MenuItem>
                ))}
              </TabletSelect>
            </FormControl>
          ) : (
            <StyledTabs
              value={activeTab}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              onChange={(_, val) => {
                const tab = filteredMainTabs.find((t) => t.id === val);
                if (tab && tab.status !== 'Disabled') handleMainTabChange(tab.id, tab.path);
              }}
            >
              {filteredMainTabs.map((tab) => (
                <Tooltip
                  key={tab.id}
                  title={tab.status === 'Disabled' ? 'This module is currently unavailable' : ''}
                  placement="top"
                  arrow
                  disableFocusListener
                >
                  <Tab
                    value={tab.id}
                    disabled={tab.status === 'Disabled'}
                    label={
                      <MainTabItem
                        isActive={activeTab === tab.id}
                        isDisabled={tab.status === 'Disabled'}
                      >
                        {tab.label}
                      </MainTabItem>
                    }
                    disableRipple
                  />
                </Tooltip>
              ))}
            </StyledTabs>
          )}
        </TabsWrapper>
      </MainTabsRow>

      {showSubTabsRow && (
        <SubTabsRow isMobile={isMobile}>
          <SubTabsWrapper>
            {hasSubTabs && (
              <StyledSubTabs
                value={activeSubTab}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                onChange={(_, val) => {
                  const subTab = currentSubTabs.find((st) => st.id === val);
                  if (subTab && subTab.status === 'Active')
                    handleSubTabChange(subTab.id, subTab.path);
                }}
              >
                {currentSubTabs.map((subTab) => (
                  <Tooltip
                    key={subTab.id}
                    title={
                      subTab.status === 'Disabled'
                        ? 'This sub-module is currently unavailable'
                        : subTab.status === 'Hidden'
                          ? 'This sub-module is hidden'
                          : ''
                    }
                    placement="top"
                    arrow
                    disableFocusListener
                  >
                    <Tab
                      value={subTab.id}
                      disabled={subTab.status !== 'Active'}
                      label={
                        <SubTabItem
                          isActive={activeSubTab === subTab.id}
                          isDisabled={subTab.status !== 'Active'}
                        >
                          {subTab.label}
                        </SubTabItem>
                      }
                      disableRipple
                    />
                  </Tooltip>
                ))}
              </StyledSubTabs>
            )}
          </SubTabsWrapper>

          <ActionsGroup isMobile={isMobile}>
            {shouldShowPrint && (
              <PrintButton
                size="small"
                variant="outlined"
                onClick={onPrint}
                startIcon={<PrintIcon />}
                isMobile={isMobile}
              >
                Print
              </PrintButton>
            )}
            {shouldShowReload && (
              <ReloadButton
                size="small"
                variant="outlined"
                onClick={onReload}
                disabled={isReloading}
                startIcon={<RefreshIcon />}
                isMobile={isMobile}
              >
                Reload
              </ReloadButton>
            )}
            {shouldShowExport && (
              <ExportButton
                size="small"
                variant="contained"
                onClick={onExportWizard}
                isMobile={isMobile}
              >
                Export Wizard
              </ExportButton>
            )}
          </ActionsGroup>
        </SubTabsRow>
      )}
    </Container>
  );
};

export default FinancialsTabs;
