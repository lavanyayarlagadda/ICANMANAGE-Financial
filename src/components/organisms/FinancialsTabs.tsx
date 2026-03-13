import React, { useEffect } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import Button from '@/components/atoms/Button';
import Tabs from '@/components/atoms/Tabs';
import AddIcon from '@mui/icons-material/Add';
import { useAppSelector } from '@/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '@/store/slices/uiSlice';

const tabPathsMap: Record<number, string> = {
  0: '/financials/all-transactions',
  1: '/financials/payments',
  2: '/financials/pip',
  3: '/financials/forward-balances',
  4: '/financials/recoupments',
  5: '/financials/other-adjustments',
  6: '/financials/variance-analysis',
  7: '/financials/trends-forecast',
};

const tabLabels = [
  'All Transactions',
  'Payments',
  'PIP',
  'Forward Balances',
  'Recoupments',
  'Other Adjustments',
  'Variance Analysis',
  'Trends & Forecast',
];

interface FinancialsTabsProps {
  onAddNew: () => void;
}

interface TabData {
  label: string;
  value: number;
  disabled: boolean;
}

const FinancialsTabs: React.FC<FinancialsTabsProps> = ({ onAddNew }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const activeTab = useAppSelector((s) => s.ui.activeTab);
  const menus = useAppSelector((s) => s.auth.user?.menus || []);

  useEffect(() => {
    const tabIndex = Object.entries(tabPathsMap).find(([_, path]) => path === location.pathname)?.[0];
    if (tabIndex !== undefined && parseInt(tabIndex) !== activeTab) {
      dispatch(setActiveTab(parseInt(tabIndex)));
    }
  }, [location.pathname, dispatch, activeTab]);

  const getMenuStatus = (label: string) => {
    const findStatus = (menusArray: typeof menus): string | null => {
      for (const m of menusArray) {
        if (m.menuName === label) return m.status;
        if (m.subModules) {
          const sub = findStatus(m.subModules);
          if (sub) return sub;
        }
      }
      return null;
    };
    return findStatus(menus) || 'Hidden';
  };

  const tabsData: TabData[] = tabLabels.map((label, index) => {
    const status = getMenuStatus(label);
    if (status === 'Hidden') return null;
    return { label, value: index, disabled: status === 'Disabled' };
  }).filter(Boolean) as TabData[];

  if (getMenuStatus('Financials') === 'Hidden') {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Financials
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A unified view of all payments, recoupments, and settlements.
          </Typography>
        </Box>
        {/* <Button
          variant="contained"
          icon={<AddIcon />}
          iconPosition="start"
          size={isMobile ? 'small' : 'medium'}
          onClick={onAddNew}
          label="Add New"
        /> */}
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, v) => {
          const path = tabPathsMap[v as number];
          if (path) navigate(path);
        }}
        tabs={tabsData}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          '& .MuiTab-root': {
            minWidth: 'auto',
            px: { xs: 1.5, md: 2 },
            fontFamily: 'Inter, "Segoe UI", system-ui, -apple-system, sans-serif',
            fontWeight: 500,
            fontSize: '13px',
            color: 'rgb(10, 22, 40)',
            textTransform: 'none',
          },
          '& .MuiTabScrollButton-root': {
            width: 36,
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`,
            mx: 0.5,
            my: 'auto',
            height: 32,
            opacity: 1,
            '&.Mui-disabled': {
              opacity: 0.3,
            },
          },
        }}
      />
    </Box>
  );
};

export default FinancialsTabs;
