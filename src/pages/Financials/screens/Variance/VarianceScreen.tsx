import React, { useMemo } from 'react';
import { Typography, Grid } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { formatCurrency, formatDate } from '@/utils/formatters';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import MultiValueDisplay from '@/components/atoms/MultiValueDisplay/MultiValueDisplay';
import {
  ScreenWrapper,
  HeaderSection,
  HeaderTitle,
  PatientNameText,
  BoldAmount,
  MonospaceText,
  VarianceText,
  ToolbarWrapper,
  SearchField,
  SummaryGrid,
  SearchWrapper,
  StyledSearchIcon,
  SearchButton,
  _ErrorAlert,
} from './VarianceScreen.styles';
import { useVarianceScreen } from './VarianceScreen.hook';

import { FeeScheduleVariance, PaymentVariance } from '@/interfaces/financials';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';

const VarianceScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const {
    activeSubTab,
    queryParams,
    globalFilters,
    feeData,
    feeSummaryData,
    paymentData,
    paymentSummaryData,
    totalElementsFee,
    totalElementsPayment,
    handleDrillDown,
    handleRangeChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    searchTerm,
    setSearchTerm,
    onSearch,
    handleFilterChange,
    payerOptions,
    payerOptionsLoading,
    payerOptionsError,
    isFetching,
    // isError,
  } = useVarianceScreen({ skip });

  const feeColumns = useMemo<DataColumn<FeeScheduleVariance | PaymentVariance>[]>(
    () => [
      {
        id: 'actions',
        label: 'Actions',
        minWidth: 60,
        render: (r) => <RowActionMenu onView={() => handleDrillDown(r)} />,
      },
      {
        id: 'transactionNo',
        label: 'TRANSACTION NO',
        minWidth: 160,
        align: 'center',
        accessor: (r) => r.transactionNo || r.id || '-',
        render: (r) => (
          <MonospaceText variant="body2">{r.transactionNo || r.id || '-'}</MonospaceText>
        ),
      },
      {
        id: 'paymentDate',
        label: 'PAYMENT DATE',
        minWidth: 120,
        align: 'center',
        accessor: (r) => r.paymentDate || '',
        render: (r) => <Typography variant="body2">{formatDate(r.paymentDate)}</Typography>,
      },
      {
        id: 'patientName',
        label: 'PATIENT NAME',
        minWidth: 150,
        accessor: (r) => r.patientName,
        render: (r) => <PatientNameText variant="body2">{r.patientName}</PatientNameText>,
      },
      {
        id: 'payerName',
        label: 'PAYER NAME',
        minWidth: 180,
        accessor: (r) => r.payerName || '',
        filterOptions: payerOptions,
        isFilterLoading: payerOptionsLoading,
        filterError: payerOptionsError,
        render: (r) => <Typography variant="body2">{r.payerName}</Typography>,
      },
      {
        id: 'expectedAllowed',
        label: 'EXPECTED ALLOWED',
        minWidth: 140,
        align: 'center',
        accessor: (r) => Number(r.expectedAllowed),
        render: (r) => (
          <BoldAmount variant="body2">{formatCurrency(Number(r.expectedAllowed))}</BoldAmount>
        ),
      },
      {
        id: 'actualAllowed',
        label: 'ACTUAL ALLOWED',
        minWidth: 140,
        align: 'center',
        accessor: (r) => Number(r.actualAllowed),
        render: (r) => (
          <BoldAmount variant="body2">{formatCurrency(Number(r.actualAllowed))}</BoldAmount>
        ),
      },
      {
        id: 'variance',
        label: 'VARIANCE',
        minWidth: 110,
        align: 'center',
        accessor: (r) => Number(r.variance),
        render: (r) => (
          <VarianceText variant="body2" amount={Number(r.variance)}>
            {formatCurrency(Number(r.variance))}
          </VarianceText>
        ),
      },
      {
        id: 'adjustmentCode',
        label: 'ADJUSTMENT CODES',
        minWidth: 150,
        align: 'center',
        accessor: (r) => r.adjustmentCode || '',
        render: (r) => (
          <MultiValueDisplay value={r.adjustmentCode || ''} delimiter="|" hideSearch={true} />
        ),
      },
    ],
    [handleDrillDown, payerOptions, payerOptionsLoading, payerOptionsError],
  );

  const summaryValues = useMemo(() => {
    const fee = feeSummaryData?.data;
    const pay = paymentSummaryData?.data;
    return activeSubTab === 0
      ? {
          tExp: fee?.totalExpected ?? 0,
          tAct: fee?.totalActualAllowed ?? 0,
          tLeak: fee?.totalLeakage ?? 0,
          lbl2: 'ACTUAL ALLOWED',
        }
      : {
          tExp: pay?.totalExpected ?? 0,
          tAct: pay?.totalActualPaid ?? 0,
          tLeak: pay?.totalLeakage ?? 0,
          lbl2: 'ACTUAL PAID',
        };
  }, [activeSubTab, feeSummaryData, paymentSummaryData]);

  return (
    <ScreenWrapper>
      <HeaderSection>
        <HeaderTitle variant="h6">
          {activeSubTab === 0 ? 'Fee Variance' : 'Payment Variance'}
        </HeaderTitle>
      </HeaderSection>

      {/* {isError && (
        <_ErrorAlert severity="error">
          Failed to load Variance details. Please try reloading or contact support.
        </_ErrorAlert>
      )} */}

      <SummaryGrid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="EXPECTED"
            value={formatCurrency(summaryValues.tExp)}
            backgroundColor="background.paper"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title={summaryValues.lbl2}
            value={formatCurrency(summaryValues.tAct)}
            backgroundColor="background.paper"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="LEAKAGE"
            value={formatCurrency(summaryValues.tLeak)}
            backgroundColor="background.paper"
          />
        </Grid>
      </SummaryGrid>

      <ToolbarWrapper>
        <SearchWrapper>
          <SearchField
            size="small"
            placeholder="Search by Transaction #"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(searchTerm)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StyledSearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <SearchButton
            variant="contained"
            size="small"
            disabled={!searchTerm}
            onClick={() => onSearch(searchTerm)}
          >
            Search
          </SearchButton>
        </SearchWrapper>
      </ToolbarWrapper>
      <DataTable
        gridName={activeSubTab === 0 ? 'Fee Schedule Variance' : 'Payment Variance'}
        columns={feeColumns}
        data={
          activeSubTab === 0 ? (feeData?.data?.content ?? []) : (paymentData?.data?.content ?? [])
        }
        rowKey={(r) => r.id || `${r.patientName}-${r.variance}`}
        exportTitle="Variance Analysis"
        customToolbarContent={
          <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
        }
        serverSide
        totalElements={activeSubTab === 0 ? totalElementsFee : totalElementsPayment}
        page={queryParams.page}
        rowsPerPage={queryParams.size}
        sortCol={queryParams.sortField}
        sortDir={queryParams.sortOrder}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        dictionaryId="variance-analysis"
        download={false}
        loading={isFetching}
      />
    </ScreenWrapper>
  );
};

export default VarianceScreen;
