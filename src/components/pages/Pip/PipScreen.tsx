import React, { useMemo, useCallback } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Accordion from "@/components/atoms/Accordion/Accordion";
import StatusBadge from "@/components/atoms/StatusBadge/StatusBadge";
import { PipRecord, NpiAllocation } from "@/interfaces/financials";
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from "@/components/atoms/RangeDropdown/RangeDropdown";
import { Box, Typography, IconButton, Chip, Grid, InputAdornment, Button, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MultiValueDisplay from "@/components/atoms/MultiValueDisplay/MultiValueDisplay";
import { formatCurrency, formatPercent, formatDate } from "@/utils/formatters";
import SummaryCard from "@/components/atoms/SummaryCard/SummaryCard";
import { themeConfig } from '@/theme/themeConfig';
import { NpiSectionWrapper, NpiHeaderRow, NpiDataRow, ToolbarWrapper, SearchField } from "./PipScreen.styles";
import { usePipScreen } from "./PipScreen.hook";

interface NpiProps {
  allocation: NpiAllocation;
}

export const NpiSection: React.FC<NpiProps> = ({ allocation }) => (
  <Box sx={{ mb: 1 }}>
    <Accordion
      defaultExpanded={false}
      summary={
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", width: "100%", gap: { xs: 1, sm: 2 } }}>
          <Typography fontSize={13} fontWeight={600} sx={{ flex: 1, wordBreak: "break-word" }}>{allocation.npiPayerName}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'space-between', sm: 'flex-end' }, width: { xs: '100%', sm: 'auto' } }}>
            <Typography textAlign="right" fontSize={13} fontWeight={600}>{formatCurrency(Number(allocation.totalPayment))}</Typography>
            <Box sx={{ textAlign: "right", pr: 1 }}><Chip label={`${formatPercent(Number(allocation.allocatedPercent ?? 0), 2)} Allocated`} size="small" variant="outlined" color="primary" /></Box>
          </Box>
        </Box>
      }
    >
      <NpiSectionWrapper>
        <NpiHeaderRow>
          <Typography fontSize={12} fontWeight={600} textAlign="center">CLAIM ID</Typography>
          <Typography fontSize={12} fontWeight={600} textAlign="center">PATIENT NAME</Typography>
          <Typography textAlign="center" fontSize={12} fontWeight={600} >ALLOWED AMT</Typography>
          <Typography textAlign="center" fontSize={12} fontWeight={600}>APPLIED TO PIP BALANCE</Typography>
        </NpiHeaderRow>
        {allocation.claims.map((claim) => (
          <NpiDataRow key={claim.claimId}>
            <Typography fontSize={13} color="primary" textAlign="center">{claim.claimId}</Typography>
            <Typography fontSize={13} textAlign="center">{claim.patientName}</Typography>
            <Typography fontSize={13} textAlign="center">{formatCurrency(Number(claim.allowedAmt))}</Typography>
            <Typography fontSize={13} textAlign="center" color="success.main">{formatCurrency(Number(claim.appliedToPipBalance))}</Typography>
          </NpiDataRow>
        ))}
      </NpiSectionWrapper>
    </Accordion>
  </Box>
);

const PipScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const {
    // canViewPip,
    pipRecords,
    totalElements,
    pipSummary,
    queryParams,
    expandedRows,
    toggleRow,
    handleRangeChange,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleExport,
    searchTerm,
    setSearchTerm,
    onSearch,
    statusOptions,
    isError,
  } = usePipScreen({ skip });
  const theme = useTheme();

  const getRowId = useCallback((row: PipRecord) => row.id || row.ptan, []);

  const columns = useMemo<DataColumn<PipRecord>[]>(() => [
    {
      id: "expand",
      label: "",
      align: "center",
      render: (row) =>
        (row.npiDetails?.length ?? 0) > 0 ? (
          <IconButton size="small" onClick={(e) => toggleRow(getRowId(row), e)}>
            {expandedRows.has(getRowId(row)) ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
          </IconButton>
        ) : null,
    },
    { id: "ptan", label: "PTAN", align: "center", accessor: (row) => row.ptan, render: (row) => row.ptan },
    { id: "paymentDate", label: "PAYMENT DATE", align: "center", accessor: (row) => row.paymentDate, render: (row) => formatDate(row.paymentDate) },
    { id: "checkEftNumber", label: "CHECK/EFT NUMBER", align: "center", accessor: (row) => row.checkEftNumber, render: (row) => <MultiValueDisplay value={row.checkEftNumber} /> },
    // { id: "description", label: "DESCRIPTION", minWidth: 180, align: "center", accessor: (row) => row.description ?? '-', render: (row) => row.description ?? '-' },
    { id: "paymentAmount", label: "PAYMENT AMOUNT", align: "center", accessor: (row) => row.paymentAmount, render: (row) => formatCurrency(Number(row.paymentAmount)) },
    { id: "payer", label: "PAYER", align: "center", accessor: (row) => row.npiDetails?.[0]?.npiPayerName ?? '-', filterOptions: ['Aetna', 'UnitedHealthcare', 'Cigna', 'Medicare'], render: (row) => row.npiDetails?.[0]?.npiPayerName ?? '-' },
    { id: "suspenseBalance", label: "SUSPENSE BALANCE", align: "center", accessor: (row) => row.suspenseBalance, render: (row) => formatCurrency(Number(row.suspenseBalance)) },
    { id: "status", label: "STATUS", align: "center", accessor: (row) => row.status, filterOptions: statusOptions, render: (row) => <StatusBadge status={row.status} /> },
  ], [expandedRows, toggleRow, getRowId, statusOptions]);

  const renderExpandedContent = useCallback((row: PipRecord) => {
    if (!row.npiDetails?.length) return null;
    return <Box>{row.npiDetails.map((allocation) => <NpiSection key={allocation.npiPayerName} allocation={allocation} />)}</Box>;
  }, []);

  // if (!canViewPip) return null;
  return (
    <Box sx={{ position: 'relative' }}>
      <ToolbarWrapper>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <SearchField
            size="small"
            placeholder="Search by Transaction #"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(searchTerm)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => onSearch(searchTerm)}
            sx={{ height: '36px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 2 }}
          >
            Search
          </Button>
        </Box>
      </ToolbarWrapper>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="TOTAL PAID AMOUNT" value={formatCurrency(pipSummary?.totalPaidAmount ?? 0)} backgroundColor={themeConfig.colors.surface} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="TOTAL SUSPENSE BALANCE" value={formatCurrency(pipSummary?.totalSuspenseBalance ?? 0)} backgroundColor={themeConfig.colors.surface} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="ACTION REQUIRED" value={pipSummary?.actionRequired?.toString() || '0'} variant="default" backgroundColor={themeConfig.colors.surface} /></Grid>
      </Grid>
      <DataTable
        columns={columns} data={pipRecords || []} rowKey={getRowId} expandedRows={expandedRows}
        expandedContent={renderExpandedContent} exportTitle="PIP Records" dictionaryId="statements"
        serverSide totalElements={totalElements} page={queryParams.page} rowsPerPage={queryParams.size}
        sortCol={queryParams.sortField} sortDir={queryParams.sortOrder}
        download={false}
        onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
      />
    </Box>
  );
};

export default PipScreen;
