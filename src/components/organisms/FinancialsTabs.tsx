import React from 'react';
import { Tabs, Tab, Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveTab } from '@/store/slices/uiSlice';
import { openAddDialog } from '@/store/slices/financialsSlice';

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

const FinancialsTabs: React.FC<FinancialsTabsProps> = ({ onAddNew }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((s) => s.ui.activeTab);

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
        <Button variant="contained" startIcon={<AddIcon />} size={isMobile ? 'small' : 'medium'} onClick={onAddNew}>
          Add New
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, v) => dispatch(setActiveTab(v))}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          '& .MuiTab-root': {
            minWidth: 'auto',
            px: { xs: 1.5, md: 2 },
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
      >
        {tabLabels.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
    </Box>
  );
};

export default FinancialsTabs;
